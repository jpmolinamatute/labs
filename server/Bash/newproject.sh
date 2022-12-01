#!/usr/bin/env bash

PROJECT_NAME="${1}"
PYTHON_VERSION_SHORT="3.10"
PYTHON_VERSION_LONG="${PYTHON_VERSION_SHORT}".8
PYTHON_VERSION_BLACK="310"
MYDIR="$(pwd)/${PROJECT_NAME}"
CONFIG_FILE="${MYDIR}/pyproject.toml"
MAIN_PATH="${MYDIR}/main.py"
set -e

create_project() {
    cd "${MYDIR}" || exit 1
    if ! pyenv versions | grep "${PYTHON_VERSION_LONG}" >/dev/null; then
        pyenv install "${PYTHON_VERSION_LONG}"
    fi
    pyenv local "${PYTHON_VERSION_LONG}"
    pip install --upgrade pip
    if ! pyenv which poetry &>/dev/null; then
        pip install -U poetry
    fi
    python -m venv .venv
    poetry init --python="${PYTHON_VERSION_LONG}" --dev-dependency=pylint --dev-dependency=mypy --dev-dependency=pytest --dev-dependency=isort --dev-dependency=black --no-interaction
    poetry lock
    poetry install --no-root
    echo "" >>"${CONFIG_FILE}"
    poetry run pylint --generate-toml-config >>"${CONFIG_FILE}"
    virtual="$(poetry env info -p)"
    git init
    cd - || exit 1
}

if [[ -z ${1} ]]; then
    echo "Usage: $0 <project-name>"
    exit 1
fi

if [[ ! -w $(pwd) ]]; then
    echo "You must run this script from a writable directory"
    exit 1
fi

mkdir -p "${MYDIR}/.vscode" "${MYDIR}/src" "${MYDIR}/tests"
touch "${MYDIR}/src/__init__.py" "${MYDIR}/tests/__init__.py"

cat <<EOF >"${MAIN_PATH}"
#!/usr/bin/env python
import logging
import sys
from os import path


def main() -> None:
    exit_status = 0
    logging.basicConfig(level=logging.DEBUG)
    try:
        logging.info("Script %s has started", path.basename(__file__))

        logging.info("Bye!")
    except Exception as err:
        logging.exception(err)
        exit_status = 1
    finally:
        sys.exit(exit_status)


if __name__ == "__main__":
    main()
EOF

cat <<EOF >"${MYDIR}/Makefile"
SHELL := bash
.ONESHELL:

.PHONY: help clean activate_venv lint test run format typehint isort all

help:
	@echo "---------------HELP-----------------"
	@echo "To activate the virtual environment type 'make activate_venv'"
	@echo "To run pylint in the project type 'make lint'"
	@echo "To run mypy in the project type 'make typehint'"
	@echo "To run black in the project type 'make black'"
	@echo "To run test in the project type 'make test'"
	@echo "------------------------------------"

clean:
	find . -type d -name __pycache__ -exec rm -rv {} +

activate_venv:
	poetry shell

lint:
	poetry run pylint --rcfile=${CONFIG_FILE} src/

test:
	poetry run pytest

format:
	poetry run black --config=${CONFIG_FILE} src/

typehint:
	poetry run mypy --config-file=${CONFIG_FILE} src/

run:
	${MAIN_PATH}

isort:
	poetry run isort --settings-path=${CONFIG_FILE} src/

all: format isort lint typehint test
EOF

echo -e "# ${1} #" >"${MYDIR}/README.md"
{
    echo ".vscode/"
    echo ".venv/"
    echo "**/__pycache__/"
    echo "**/.env"
} >>"${MYDIR}/.gitignore"
chmod 755 "${MAIN_PATH}"

create_project

cat <<EOF >>"${CONFIG_FILE}"

[tool.isort]
profile = "black"
line_length = 120
py_version = ${PYTHON_VERSION_BLACK}
lines_after_imports = 2
virtual_env = "${virtual}"

[tool.black]
line-length = 120
target-version = ["py${PYTHON_VERSION_BLACK}"]

[tool.mypy]
python_version = "${PYTHON_VERSION_SHORT}"
sqlite_cache = true
follow_imports = "silent"
ignore_missing_imports = true
show_column_numbers = true
no_pretty = true
show_error_codes = true

[tool.pytest.ini_options]
minversion = "6.0"
testpaths = [
    "tests"
]

EOF

cat <<EOF >"${MYDIR}/.vscode/settings.json"
{
    "editor.rulers": [
        120
    ],
    "editor.wordWrap": "wordWrapColumn",
    "editor.wordWrapColumn": 120,
    "python.formatting.provider": "black",
    "python.formatting.blackPath": "${virtual}/bin/black",
    "python.formatting.blackArgs": [
        "--config=${CONFIG_FILE}"
    ],
    "python.linting.mypyEnabled": true,
    "python.linting.mypyPath": "${virtual}/bin/mypy",
    "python.linting.mypyArgs": [
        "--config-file=${CONFIG_FILE}"
    ],
    "isort.importStrategy": "fromEnvironment",
    "isort.interpreter": [
        "${virtual}/bin/python"
    ],
    "isort.path": [
        "${virtual}/bin/isort"
    ],
    "pylint.importStrategy": "fromEnvironment",
    "pylint.interpreter": [
        "${virtual}/bin/python"
    ],
    "pylint.path": [
        "${virtual}/bin/pylint"
    ],
    "pylint.args": [
        "--rcfile=${CONFIG_FILE}"
    ],

    "python.testing.pytestPath": "${virtual}/bin/pytest",
    "python.defaultInterpreterPath": "${virtual}/bin/python"
}
EOF

exit 0
