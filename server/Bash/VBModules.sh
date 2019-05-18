#!/usr/bin/env bash

KERNELVERSION=$(uname -r)
BUILDDIR="/opt/kernel-headers/${KERNELVERSION}"
MODULESDIR="/lib/modules/${KERNELVERSION}/kernel/misc"
SIGNING_SCRIP="${BUILDDIR}/scripts/sign-file"
KEYPEM="${BUILDDIR}/certs/signing_key.pem"
KEYX509="${BUILDDIR}/certs/signing_key.x509"
vBoxVersion=$(find /usr/src -type d -name "vboxhost-*" | cut -d'-' -f2)
vBoxModules=("vboxdrv.ko" "vboxnetadp.ko" "vboxnetflt.ko" "vboxpci.ko")

exitWithError() {
    local COLOR='\033[0;31m'
    local NC='\033[0m'
    echo -e " ERROR: ${COLOR}$1${NC}"
    exit 2
}

printLine() {
    local COLOR='\033[1;32m'
    local NC='\033[0m'
    echo -e "${COLOR}==>    $1${NC}"
}

printLine "Uninstalling old version of vboxhost/${vBoxVersion}"
dkms uninstall "vboxhost/${vBoxVersion}" -k "$KERNELVERSION"
printLine "Removing old version of vboxhost/${vBoxVersion}"
dkms remove "vboxhost/${vBoxVersion}" -k "$KERNELVERSION"

printLine "Building new version of vboxhost/${vBoxVersion}"
dkms build "vboxhost/${vBoxVersion}" -k "$KERNELVERSION"

printLine "Installing new version of vboxhost/${vBoxVersion}"

if ! dkms install "vboxhost/${vBoxVersion}" -k "$KERNELVERSION"; then
    exitWithError "Installing DKMS modules failed"
fi

if [[ ! -f $KEYPEM ]]; then
    exitWithError "${KEYPEM} doesn't exists"
fi
if [[ ! -f $KEYX509 ]]; then
    exitWithError "$KEYX509 doesn't exists"
fi

for module in "${vBoxModules[@]}"; do
    if [[ -f ${MODULESDIR}/${module} ]]; then
        printLine "Signing module $module"
        if ! $SIGNING_SCRIP sha1 "$KEYPEM" "$KEYX509" "${MODULESDIR}/${module}"; then
            exitWithError "Signing module $module failed"
        fi
    else
        exitWithError "${MODULESDIR}/${module} doesn't exists"
    fi
done
exit 0
