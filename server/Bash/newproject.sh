#!/usr/bin/env bash

PYTHON_VERSION_SHORT="3.11"
PYTHON_VERSION_LONG="${PYTHON_VERSION_SHORT}.4"
PYTHON_VERSION_BLACK="311"
set -e

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
        elif [[ ! $project_name =~ ^[a-z][a-z0-9-]+[a-z]$ ]]; then
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
    local project_name="${1}"
    mkdir -p "${project_name}/.vscode" "${project_name}/src" "${project_name}/tests"
    touch "${project_name}/src/__init__.py" "${project_name}/tests/__init__.py"

    cat <<EOF >"${project_name}/main.py"
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
from invoke import task, Collection

ns = Collection()


@task
def run_isort(c) -> None:
    """Run isort on source"""
    print("Running ISORT")
    print("-------------")
    c.run("isort --settings-path=./pyproject.toml ./src", pty=True)
    print("Done")


@task
def run_black(c) -> None:
    """Run black code formatter on source"""
    print("Running BLACK")
    print("-------------")
    c.run("black --config=./pyproject.toml ./src", pty=True)
    print("Done")


@task
def run_pylint(c) -> None:
    """Run pylint on source"""
    print("Running PYLINT")
    print("--------------")
    c.run("pylint --rcfile=./pyproject.toml ./src ./tests", pty=True)
    print("Done")


@task
def run_mypy(c) -> None:
    """Run mypy type checking on source"""
    print("Running MYPY")
    print("------------")
    c.run("mypy --config-file=./pyproject.toml --check-untyped-defs ./src ./tests", pty=True)
    print("Done")


@task
def run_all(c) -> None:
    """Run all code quality checks"""
    run_isort(c)
    run_black(c)
    run_pylint(c)
    run_mypy(c)


ns = Collection()
precheck = Collection("precheck")
precheck.add_task(run_pylint, "pylint")
precheck.add_task(run_mypy, "mypy")
precheck.add_task(run_black, "black")
precheck.add_task(run_isort, "isort")
precheck.add_task(run_all, "all")
ns.add_collection(precheck)
EOF

    cat <<EOF >"${project_name}/.vscode/settings.json"
{
    "editor.rulers": [
        100
    ],
    "editor.wordWrap": "wordWrapColumn",
    "editor.wordWrapColumn": 100,
    "python.formatting.provider": "black",
    "python.formatting.blackPath": "./.venv/bin/black",
    "python.formatting.blackArgs": [
        "--config=./pyproject.toml"
    ],
    "python.linting.mypyEnabled": true,
    "python.linting.mypyPath": "./.venv/bin/mypy",
    "python.linting.mypyArgs": [
        "--config-file=./pyproject.toml"
    ],
    "isort.importStrategy": "fromEnvironment",
    "isort.interpreter": [
        "./.venv/bin/python"
    ],
    "isort.path": [
        "./.venv/bin/isort"
    ],
    "isort.args": [
        "--settings-path=./pyproject.toml"
    ],
    "pylint.importStrategy": "fromEnvironment",
    "pylint.interpreter": [
        "./.venv/bin/python"
    ],
    "pylint.path": [
        "./.venv/bin/pylint"
    ],
    "pylint.args": [
        "--rcfile=./pyproject.toml"
    ],

    "python.testing.pytestPath": "./.venv/bin/pytest",
    "python.defaultInterpreterPath": "./.venv/bin/python",
    "[python]": {
        "editor.defaultFormatter": "ms-python.black-formatter"
    }
}
EOF

    echo -e " # ${1} #" >"${project_name}/README.md"
    {
        echo ".venv/"
        echo "**/__pycache__/"
        echo "**/.env"
    } >>"${project_name}/.gitignore"
    chmod 755 "${project_name}/main.py"
}

update_config_file() {
    cat <<EOF >>"${1}/pyproject.toml"
[tool.isort]
profile = "black"
line_length = 120
py_version = ${PYTHON_VERSION_BLACK}
lines_after_imports = 2
virtual_env = "./.venv"

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
    echo "" >>"./pyproject.toml"
    poetry run pylint --generate-toml-config >>./pyproject.toml
    sed -i "s/# init-hook =/init-hook = 'import sys; sys.path.append(\"src\")'/" ./pyproject.toml
    sed -i "s/jobs = 4/jobs = 0/" ./pyproject.toml
    cd - >>/dev/null || exit 1
}

run() {
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
