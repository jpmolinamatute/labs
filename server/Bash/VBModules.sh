#!/usr/bin/env bash

KERNELVERSION=$(uname -r)
BUILDDIR="/opt/kernel-headers/${KERNELVERSION}"
MODULESDIR="/usr/lib/modules/${KERNELVERSION}/kernel/misc"
SIGNING_SCRIP="${BUILDDIR}/scripts/sign-file"
KEYPEM="${BUILDDIR}/certs/signing_key.pem"
KEYX509="${BUILDDIR}/certs/signing_key.x509"
vBoxVersion=$(find /usr/src -type d -name "vboxhost-*" | cut -d'-' -f2)
vBoxModules=("vboxdrv" "vboxnetadp" "vboxnetflt" "vboxpci")

printLine() {
    local green='\e[32m'
    local end='\e[0m'
    echo -e "${green}==>    $1${end}"
}

exitWithError() {
    local red='\e[31m'
    local end='\e[0m'
    echo -e "${red}==>    ERROR: $1${end}" >&2
    exit 2
}

if [[ $EUID -ne 0 ]]; then
    exitWithError "This script must be run as root"
fi

printLine "Uninstalling old version of vboxhost/${vBoxVersion}"
if dkms uninstall -k "$KERNELVERSION" --verbose "vboxhost/${vBoxVersion}"; then
    printLine "Removing old version of vboxhost/${vBoxVersion}"
    dkms remove -k "$KERNELVERSION" --verbose "vboxhost/${vBoxVersion}"
fi
printLine "Building new version of vboxhost/${vBoxVersion}"
if ! dkms build -k "$KERNELVERSION" --verbose "vboxhost/${vBoxVersion}"; then
    exitWithError "Building new version of vboxhost/${vBoxVersion} failed"
fi

printLine "Installing new version of vboxhost/${vBoxVersion}"
if ! dkms install -k "$KERNELVERSION" --verbose "vboxhost/${vBoxVersion}"; then
    exitWithError "Installing DKMS modules failed"
fi

if [[ ! -f $KEYPEM ]]; then
    exitWithError "${KEYPEM} doesn't exists"
fi

if [[ ! -f $KEYX509 ]]; then
    exitWithError "$KEYX509 doesn't exists"
fi

if [[ ! -x $SIGNING_SCRIP ]]; then
    exitWithError "$SIGNING_SCRIP doesn't exists"
fi

for module in "${vBoxModules[@]}"; do
    if [[ -f ${MODULESDIR}/${module} ]]; then
        printLine "Signing module $module"
        if ! $SIGNING_SCRIP sha1 "$KEYPEM" "$KEYX509" "${MODULESDIR}/${module}.ko.xz"; then
            exitWithError "Signing module $module failed"
        fi
    else
        exitWithError "${MODULESDIR}/${module} doesn't exists"
    fi
done
exit 0
