#!/usr/bin/env bash

PYTHON_VERSION="3.12"

set -e

get_python_version() {
    # @TODO: I would like to rewrite this function in the future to return the
    #        Python version in the format that the calling function expects it, i.e.:
    #        3.12, 3.12.0, 312, etc.

    if [[ -z ${PYTHON_VERSION} ]]; then
        exit 1
    elif [[ ${PYTHON_VERSION} =~ ^[0-9]+\.[0-9]+$ ]]; then
        PYTHON_VERSION_SHORT="${PYTHON_VERSION}"
        PYTHON_VERSION_LONG="${PYTHON_VERSION}.0"
        PYTHON_VERSION_BLACK="${PYTHON_VERSION//./}"
    elif [[ ${PYTHON_VERSION} =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        PYTHON_VERSION_SHORT="${PYTHON_VERSION%.*}"
        PYTHON_VERSION_LONG="${PYTHON_VERSION}"
        PYTHON_VERSION_BLACK="${PYTHON_VERSION//./}"
    else
        echo "Error: ${PYTHON_VERSION} is not a valid Python version" >&2
        exit 1
    fi
}

preflight_check() {
    local project_raw_path="${1}"
    if [[ -z ${project_raw_path} ]]; then
        echo "Usage: $0 <project-path>/<project-name>"
        exit 1
    fi
    project_path="$(realpath "$(dirname "${project_raw_path}")")"
    if [[ -d "${project_path}" ]]; then
        if [[ ! -w ${project_path} ]]; then
            echo "Error: ${project_path} is not writable" >&2
            exit 1
        fi
        project_name="$(basename "${project_raw_path}")"
        if [[ -d ${project_path}/${project_name} ]]; then
            echo "Error: ${project_path}/${project_name} already exists" >&2
            exit 1
        elif [[ ! $project_name =~ ^[a-z][a-z0-9_-]+[a-z0-9]$ ]]; then
            echo "Error: ${project_name} is not a valid project name" >&2
            exit 1
        fi
    else
        echo "Error: ${project_path} does not exist" >&2
        exit 1
    fi
    if ! command -v pyenv &>/dev/null; then
        echo "Error: pyenv is not installed" >&2
        exit 1
    fi
}

create_files() {
    local project_root="${1}"
    mkdir -p "${project_root}/.vscode" "${project_root}"/app/{src,tests}
    touch "${project_root}"/app/{src,tests}/__init__.py

    cat <<EOF >"${project_root}/app/src/main.py"
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

    cat <<EOF >"${project_name}/tasks.py"
from pathlib import Path
import shutil

from invoke import task, Context, Collection

CURRENT_SCRIPT = Path(__file__).resolve()
PROJECT_ROOT = CURRENT_SCRIPT.parent
PYPROJECT = PROJECT_ROOT.joinpath("/pyproject.toml")
APP_ROOT = PROJECT_ROOT.joinpath("/src/app")
PTY = True
ECHO = True

ns = Collection()
lint = Collection("lint")
tests = Collection("tests")


def _log_open(msg: str) -> None:
    terminal_size = shutil.get_terminal_size((80, 20))
    char_to_use = "="
    width = terminal_size.columns
    print(f"\n{char_to_use*width}")
    padding = (width - len(msg) - 12) // 2
    msg = f"{char_to_use*padding} Running '{msg}' {char_to_use*padding}"
    if len(msg) < width:
        msg += char_to_use
    print(msg)
    print(f"{char_to_use*width}\n")


def _run_pylint(ctx: Context, ignore_failures: bool = True) -> None:
    cmd = f"pylint --rcfile {PYPROJECT} {APP_ROOT}"
    _log_open("pylint")
    ctx.run(cmd, pty=PTY, echo=ECHO, warn=ignore_failures)


def _run_black(ctx: Context, ignore_failures: bool = True) -> None:
    cmd = f"black --config {PYPROJECT} {APP_ROOT}"
    _log_open("black")
    ctx.run(cmd, pty=PTY, echo=ECHO, warn=ignore_failures)


def _run_isort(ctx: Context, ignore_failures: bool = True) -> None:
    cmd = f"isort --settings-path {PYPROJECT} {APP_ROOT}"
    _log_open("isort")
    ctx.run(cmd, pty=PTY, echo=ECHO, warn=ignore_failures)


def _run_mypy(ctx: Context, ignore_failures: bool = True) -> None:
    cmd = f"mypy --config-file {PYPROJECT} {APP_ROOT}"
    _log_open("mypy")
    ctx.run(cmd, pty=PTY, echo=ECHO, warn=ignore_failures)


@task(name="pylint")
def pylint(ctx: Context) -> None:
    _run_pylint(ctx)


@task(name="black")
def black(ctx: Context) -> None:
    _run_black(ctx)


@task(name="isort")
def isort(ctx: Context) -> None:
    _run_isort(ctx)


@task(name="mypy")
def mypy(ctx: Context) -> None:
    _run_mypy(ctx)


@task(name="run_all")
def run_all(ctx: Context, ignore_failures: bool = True) -> None:
    print("Running ALL linting tools")
    _run_black(ctx, ignore_failures)
    _run_isort(ctx, ignore_failures)
    _run_mypy(ctx, ignore_failures)
    _run_pylint(ctx, ignore_failures)


lint.add_task(pylint)
lint.add_task(black)
lint.add_task(isort)
lint.add_task(mypy)
lint.add_task(run_all)


@task(name="pytest")
def pytest(ctx: Context) -> None:
    test_path = APP_ROOT.joinpath("/src/tests")
    cmd = f"pytest --config-file={PYPROJECT} {test_path}"
    _log_open("pytest")
    ctx.run(cmd, pty=PTY, echo=ECHO)


tests.add_task(pytest)
ns.add_collection(lint)
ns.add_collection(tests)
EOF

    echo -e " # ${1} #" >"${project_name}/README.md"
    {
        echo ".venv/"
        echo "**/__pycache__/"
        echo "**/.env"
    } >>"${project_name}/.gitignore"

    chmod 755 "${project_name}/app/src/main.py"
}

update_config_file() {
    cat <<EOF >>"${1}/pyproject.toml"
[tool.isort]
profile = "black"
line_length = 100
py_version = ${PYTHON_VERSION_BLACK}
lines_after_imports = 2
virtual_env = "./.venv"

[tool.black]
line-length = 100
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

}

configuring_poetry() {
    cd "${1}" || exit 1
    if ! pyenv versions | grep "${PYTHON_VERSION_LONG}" >/dev/null; then
        echo "Installing Python ${PYTHON_VERSION_LONG}"
        pyenv install "${PYTHON_VERSION_LONG}"
    fi
    pyenv local "${PYTHON_VERSION_LONG}"
    pip install --upgrade pip
    if ! pyenv which poetry &>/dev/null; then
        echo "Installing Poetry"
        pip install -U poetry
    fi
    echo "Configuring Poetry"
    poetry config virtualenvs.in-project true --local
    poetry config virtualenvs.create true --local
    poetry init --python="${PYTHON_VERSION_LONG}" --dev-dependency=pylint --dev-dependency=mypy --dev-dependency=pytest --dev-dependency=isort --dev-dependency=black --dev-dependency=invoke --dev-dependency=types-invoke --dev-dependency=bpython --no-interaction
    poetry install --no-root --sync
    sed -i "7i package-mode = false" ./pyproject.toml
    sed -i "8i\\" ./pyproject.toml

    echo "" >>./pyproject.toml
    poetry run pylint --generate-toml-config >>./pyproject.toml
    sed -i "s/^# init-hook =/init-hook = 'import sys; sys.path.append(\"app\/src\")'/" ./pyproject.toml
    sed -i "s/^#? ?jobs = [0-9]/jobs = 0/" ./pyproject.toml
    sed -i '/disable = \[/ s/\]/, "missing-module-docstring", "missing-function-docstring"]/' ./pyproject.toml
    cd - >>/dev/null || exit 1
}

run() {
    get_python_version
    preflight_check "${1}"
    project_path="$(realpath "$(dirname "${1}")")"
    project_path="${project_path}/$(basename "${1}")"
    create_files "${project_path}"
    configuring_poetry "${project_path}"
    update_config_file "${project_path}"
    git init "${project_path}"
}

run "${@}"
exit 0
