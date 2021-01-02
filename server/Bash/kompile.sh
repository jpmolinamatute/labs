#!/usr/bin/env bash

CPUNO="$(nproc)"
THISPATH="$(readlink -f "$0")"
THISSCRIPT="$(basename "$THISPATH")"
SRCDIR="$(cd "$(dirname "$THISPATH")" && pwd)"
ERRORFILE="${SRCDIR}/Error"
KERNELNAME="$(hostname)"
TARFILE=
TEMPLATEFILE=
BASEDIR=
KERNELVERSION=
DRY=

vercomp() {
    # FROM https://stackoverflow.com/questions/4023830/how-compare-two-strings-in-dot-separated-version-format-in-bash
    # thanks Dennis Williamson
    if [[ $1 == "$2" ]]; then
        return 0
    fi
    local IFS='.'
    local i ver1 ver2
    read -r -a ver1 <<<"$1"
    read -r -a ver2 <<<"$2"

    # fill empty fields in ver1 with zeros
    for ((i = ${#ver1[@]}; i < ${#ver2[@]}; i++)); do
        ver1[i]=0
    done
    for ((i = 0; i < ${#ver1[@]}; i++)); do
        if [[ -z ${ver2[i]} ]]; then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]})); then
            return 2
        fi
    done
    return 0
}

writeToErrorFile() {
    if [[ -n $1 ]]; then
        echo "$1" >>"$ERRORFILE"
    fi
}

writeErrorSectionFile() {
    if [[ $1 == "start" ]]; then
        local startend="START"
    else
        local startend="END"
    fi
    writeToErrorFile "****** $startend OF SECTION: $2 ******"
}

exitWithError() {
    local red='\e[31m'
    local end='\e[0m'
    echo -e "${red}ERROR: $1${end}" >&2
    writeToErrorFile "ERROR: $1"
    if [[ -n $2 ]]; then
        writeErrorSectionFile "end" "$2"
    fi
    echo "Please read $ERRORFILE for more information" >&2
    exit 2
}

printLine() {
    local green='\e[32m'
    local end='\e[0m'
    echo -e "${green}==>    $1${end}"
}

checkDirectory() {
    local dir=$1
    if [[ -n ${dir} ]]; then
        if [[ ! -d ${dir} || ! -w ${dir} ]]; then
            exitWithError "Directory '${dir}' doesn't exists or it's not writable"
        fi
    fi
}

checkSystem() {
    echo "#####  Error log start here  #####" >"$ERRORFILE"
    local sectionName="checking system"
    writeErrorSectionFile "start" "$sectionName"
    if [[ $DRY -eq 0 && $EUID -ne 0 ]]; then
        exitWithError "This script must be run as root" "$sectionName"
    fi

    if ! command -v bc &>/dev/null; then
        exitWithError "Please install bc" "$sectionName"
    fi

    if ! command -v zcat &>/dev/null; then
        exitWithError "Please install zcat" "$sectionName"
    fi

    if ! command -v rsync &>/dev/null; then
        exitWithError "Please install rsync" "$sectionName"
    fi

    if [[ -z $KERNELNAME ]]; then
        exitWithError "Please provide a name" "$sectionName"
    fi

    checkDirectory "$BASEDIR"
    writeErrorSectionFile "end" "$sectionName"
}

downloadSources() {
    local tarFile
    local mayorVersion
    local sectionName="downloading sources"
    writeErrorSectionFile "start" "$sectionName"
    tarFile="$(wget --output-document - --quiet https://www.kernel.org/ | grep -A 1 "latest_link" | grep -Eo "linux-[4-9]\\.[0-9]+\\.?[0-9]*\\.tar\\.xz")"
    mayorVersion="$(echo "$tarFile" | cut -d'-' -f2 | cut -d'.' -f1)"
    TARFILE="${SRCDIR}/$tarFile"
    if [[ ! -f "${SRCDIR}/$tarFile" ]]; then
        printLine "Downloading ${tarFile} to ${TARFILE}"
        if ! wget -P "${SRCDIR}" --https-only "https://cdn.kernel.org/pub/linux/kernel/v${mayorVersion}.x/${tarFile}"; then
            exitWithError "Downloading 'linux-v${mayorVersion}.x/${tarFile}' failed" "$sectionName"
        fi
    fi
    writeErrorSectionFile "end" "$sectionName"
}

setVariables() {
    local sectionName="setting variables"
    local tmp_dir
    writeErrorSectionFile "start" "$sectionName"
    tmp_dir="$(mktemp -d -t "${THISSCRIPT}-XXXXXXXXXX")"
    if ! tar -xf "${TARFILE}" -C "${tmp_dir}" --strip-components=1; then
        exitWithError "failed to temporally extract sources"
    fi
    cd "${tmp_dir}" || exit 2
    KERNELVERSION="$(make -s kernelversion 2>/dev/null)-${KERNELNAME}"
    cd "${SRCDIR}" || exit 2
    rm -rf "${tmp_dir}"
    if [[ $DRY -eq 1 ]]; then
        BASEDIR="${SRCDIR}/tmpKernel"
    else
        BASEDIR="/usr/lib/modules"
    fi

    MODULESDIR="${BASEDIR}/${KERNELVERSION}"
    SOURCESDIR="${MODULESDIR}/build"
    CONFIGFILE="${SOURCESDIR}/.config"
    if [[ -d ${MODULESDIR} ]]; then
        printLine "removing old '${MODULESDIR}'"
        rm -rf "${MODULESDIR}"
    fi
    if ! mkdir -p "${SOURCESDIR}" 2>/dev/null; then
        exitWithError "directory '${BASEDIR}' is not writable"
    fi
    writeErrorSectionFile "end" "$sectionName"
}

extractSources() {
    local sectionName="extracting sources"
    writeErrorSectionFile "start" "$sectionName"
    printLine "Untaring ${TARFILE} to ${SOURCESDIR}"
    if ! tar -xf "${TARFILE}" -C "${SOURCESDIR}" --strip-components=1; then
        exitWithError "Untaring ${TARFILE} failed" "$sectionName"
    fi

    writeErrorSectionFile "end" "$sectionName"
}

prepareBuildDir() {
    local sectionName="preparing build directoy"
    writeErrorSectionFile "start" "$sectionName"
    printLine "make -j${CPUNO} V=0 distclean"
    if ! make -j"${CPUNO}" V=0 distclean 2>>"$ERRORFILE"; then
        exitWithError "'make distclean' failed" "$sectionName"
    fi

    if [[ -f $TEMPLATEFILE ]]; then
        printLine "Config file found: $TEMPLATEFILE and copied to $CONFIGFILE"
        if ! cp "$TEMPLATEFILE" "$CONFIGFILE"; then
            exitWithError "copying $TEMPLATEFILE to $CONFIGFILE failed" "$sectionName"
        fi
        if ! chmod 644 "$CONFIGFILE"; then
            exitWithError "changing permission of $CONFIGFILE failed" "$sectionName"
        fi
    else
        local procConfig="/proc/config.gz"
        if [[ -f $procConfig ]]; then
            printLine "Config file found: $procConfig and copied to $CONFIGFILE"
            if ! zcat $procConfig >"$CONFIGFILE"; then
                exitWithError "creating $CONFIGFILE failed" "$sectionName"
            fi
            # elif [[ -f /boot/[Cc]onfig* ]]; then
            #     printLine "Config file found: $procConfig"
            # 	cp "$TEMPLATEFILE" "$CONFIGFILE"
            #     chmod 644 "$CONFIGFILE"
            #     exitWithError "CODE ME, please! I beg you."
            # get the highest config file from all and then cat it to ${SOURCESDIR}/.config"
        else
            exitWithError "We couldn't find a config file to use." "$sectionName"
        fi
    fi
    writeErrorSectionFile "end" "$sectionName"
}

runOlddefconfig() {
    local validation
    local templateversion
    local version
    templateversion="$(grep -E "# Linux/x86 [0-9.-]* Kernel Configuration" "$CONFIGFILE" | cut -d' ' -f3 | cut -d'-' -f1)"
    version="$(echo "$KERNELVERSION" | cut -d'-' -f1)"
    vercomp "${version}" "${templateversion}"
    validation="$?"
    if [[ $validation -eq 1 ]]; then
        local sectionName="Validating config version"
        writeErrorSectionFile "start" "$sectionName"
        printLine "make -j${CPUNO} V=0 olddefconfig"
        if ! make -j"${CPUNO}" V=0 olddefconfig 2>>"$ERRORFILE"; then
            exitWithError "'make olddefconfig' failed" "$sectionName"
        fi
        writeErrorSectionFile "end" "$sectionName"
    elif [[ $validation -eq 2 ]]; then
        exitWithError "You are downgrading your kernel, this is not supported" "$sectionName"
    fi
}

modifyConfig() {
    local rootfstype
    local rootuuid
    local txt
    local swapuuid
    local sectionName="Updating config file"
    writeErrorSectionFile "start" "$sectionName"
    rootfstype="$(lsblk -o MOUNTPOINT,FSTYPE | grep -E "^/ " | awk '{print $2}')"
    rootuuid="$(lsblk -o MOUNTPOINT,PARTUUID | grep -E "^/ " | awk '{print $2}')"
    swapuuid="$(lsblk -o FSTYPE,PARTUUID | grep -E "^swap " | awk '{print $2}')"
    txt="CONFIG_CMDLINE_BOOL=y\\n"
    txt="${txt}CONFIG_CMDLINE=\"rootfstype=${rootfstype} root=PARTUUID=${rootuuid} rw\"\\n"
    # txt="${txt}CONFIG_CMDLINE_OVERRIDE=y\n"

    # sed -Ei "s/^#? ?CONFIG_CMDLINE_OVERRIDE(=[ynm]| is not set)//" "$CONFIGFILE"
    sed -Ei "s/^#? ?CONFIG_CMDLINE[ =].*//" "$CONFIGFILE"
    sed -Ei "s/^#? ?CONFIG_CMDLINE_BOOL(=[ynm]| is not set)/${txt}/" "$CONFIGFILE"
    sed -Ei "s/^CONFIG_LOCALVERSION=\".*\"$/CONFIG_LOCALVERSION=\"-${KERNELNAME}\"/" "$CONFIGFILE"
    sed -Ei "s/^#? ?CONFIG_PM_STD_PARTITION[ =].*$/CONFIG_PM_STD_PARTITION=\"PARTUUID=${swapuuid}\"/" "$CONFIGFILE"
    sed -Ei "s/^#? ?CONFIG_DEFAULT_HOSTNAME[ =].*$/CONFIG_DEFAULT_HOSTNAME=\"${KERNELNAME}\"/" "$CONFIGFILE"
    writeErrorSectionFile "end" "$sectionName"
}

buildKernel() {
    if [[ $DRY -eq 0 ]]; then
        local sectionName="compiling kernel"
        writeErrorSectionFile "start" "$sectionName"
        printLine "make -j${CPUNO} V=0 all"
        if ! make -j"${CPUNO}" V=0 all 2>>"$ERRORFILE"; then
            exitWithError "'make all' failed" "$sectionName"
        fi
        writeErrorSectionFile "end" "$sectionName"
    fi
}

buildModules() {
    if [[ $DRY -eq 0 ]]; then
        local sectionName="creating kernel modules"
        writeErrorSectionFile "start" "$sectionName"
        printLine "make -j${CPUNO} V=0 modules_install headers_install"
        if ! make -j"${CPUNO}" V=0 modules_install headers_install 2>>"$ERRORFILE"; then
            exitWithError "'make modules_install headers_install' failed" "$sectionName"
        fi
        writeErrorSectionFile "end" "$sectionName"
    fi
}

editConfig() {
    local sectionName="editing config file"
    writeErrorSectionFile "start" "$sectionName"
    if [[ $DRY -eq 0 ]]; then
        if [[ $EDITCONFIG -eq 1 ]]; then
            printLine "make -j${CPUNO} V=0 menuconfig"

            if ! make -j"${CPUNO}" V=0 menuconfig 2>>"$ERRORFILE"; then
                exitWithError "'make menuconfig' failed" "$sectionName"
            fi
        fi
    else
        printLine "make -j${CPUNO} V=0 xconfig"
        if ! make -j"${CPUNO}" V=0 xconfig 2>>"$ERRORFILE"; then
            exitWithError "'make xconfig' failed" "$sectionName"
        fi
    fi
    writeErrorSectionFile "end" "$sectionName"
}

saveConfig() {
    if [[ $DRY -eq 1 ]]; then
        printLine "Copying ${CONFIGFILE} to ${SRCDIR}/config-${KERNELVERSION}"
        if ! cp --remove-destination "${CONFIGFILE}" "${SRCDIR}/config-${KERNELVERSION}"; then
            exitWithError "saving ${SRCDIR}/config-${KERNELVERSION} failed"
        fi
    fi
}

install() {
    if [[ $DRY -eq 0 ]]; then
        local sectionName="installing new kernel files"
        writeErrorSectionFile "start" "$sectionName"
        printLine "Linking ${SOURCESDIR} -> /usr/src/${KERNELVERSION}"
        ln -sf "${SOURCESDIR}" "/usr/src/${KERNELVERSION}"
        if [[ -f ${SOURCESDIR}/System.map ]]; then
            printLine "Copying ${SOURCESDIR}/System.map -> /boot/System.map"
            cp --remove-destination "${SOURCESDIR}/System.map" "/boot/System.map"
        else
            exitWithError "File ${SOURCESDIR}/System.map doesn't exists" "$sectionName"
        fi

        if [[ -f ${SOURCESDIR}/arch/x86_64/boot/bzImage ]]; then
            printLine "Copying ${SOURCESDIR}/arch/x86_64/boot/bzImage -> /boot/vmlinuz-${KERNELVERSION}"
            cp --remove-destination "${SOURCESDIR}/arch/x86_64/boot/bzImage" "/boot/vmlinuz-${KERNELVERSION}"
        else
            exitWithError "File ${SOURCESDIR}/arch/x86_64/boot/bzImage doesn't exists" "$sectionName"
        fi

        printLine "Creating initramfs-${KERNELVERSION}.img file"
        if ! mkinitcpio -k "${KERNELVERSION}" -g "/boot/initramfs-${KERNELVERSION}.img"; then
            exitWithError "mkinitcpio failed" "$sectionName"
        fi

        printLine "Saving $CONFIGFILE to /boot/config-${KERNELVERSION}"
        cp --remove-destination "${CONFIGFILE}" "/boot/config-${KERNELVERSION}"
        printLine "Creating entry file"
        cat <<-EOF >"/boot/loader/entries/${KERNELVERSION}.conf"
title Arch Linux
linux /vmlinuz-${KERNELVERSION}
version ${KERNELVERSION}
initrd /intel-ucode.img
initrd /initramfs-${KERNELVERSION}.img
EOF
        writeErrorSectionFile "end" "$sectionName"
        printLine "Kernel ${KERNELVERSION} was successfully installed"
    fi
}

getUserInput() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
        "--help")
            usage
            exit 0
            ;;
        "--dry")
            shift
            DRY=1
            ;;
        "--name")
            shift
            KERNELNAME="$1"
            shift
            ;;
        "--configfile")
            shift
            TEMPLATEFILE="$(readlink -f "$1")"
            shift
            ;;
        "--tarfile")
            shift
            TARFILE="$(readlink -f "$1")"
            shift
            ;;
        *)
            exitWithError "Unknown command-line option $1"
            ;;
        esac
    done
}

getUserInput "$@"
checkSystem
if [[ ! -f ${TARFILE} ]]; then
    downloadSources
fi
setVariables
extractSources
cd "${SOURCESDIR}" || exit 2
prepareBuildDir
runOlddefconfig
modifyConfig
editConfig
buildKernel
buildModules
install
exit 0
