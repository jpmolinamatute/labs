#! /home/juanpa/Projects/labs/server/Python/.venv/bin/python
import random
import time
import string
import argparse
import pyperclip


def generate(length, alphanu):
    if not isinstance(length, int):
        raise TypeError("length must be an integer")
    if length < 8:
        raise ValueError("length must be greater than 8")
    if alphanu:
        all_char = list(f"{string.digits}{string.ascii_letters}")
        opt_num = 4
    else:
        all_char = list(f"{string.digits}{string.punctuation}{string.ascii_letters}")
        opt_num = 5
    limit1 = int(time.time())
    random.seed()
    rand1 = random.randint(0, limit1)
    random.seed(rand1)
    sub_length = int(length / opt_num)
    ext_length = (length % opt_num) + sub_length
    random.shuffle(all_char)
    result = random.choices(string.ascii_uppercase, k=sub_length)
    result += random.choices(string.ascii_lowercase, k=ext_length)
    result += random.choices(string.digits, k=sub_length)
    if not alphanu:
        result += random.choices(string.punctuation, k=sub_length)
    result += random.choices(all_char, k=sub_length)

    random.shuffle(result)
    random.shuffle(result)
    password = "".join(result)
    print(f"Your new Password is {password} and it was copied to your clipboard")
    pyperclip.copy(password)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate random password")
    parser.add_argument(
        "--length",
        dest="length",
        type=int,
        choices=range(8, 40),
        required=True,
        default=10,
        help="Length of password to be generated. Default: 10",
    )

    parser.add_argument(
        "--onlyalphanum",
        action="store_true",
        dest="alphanu",
        help="Create password using onlu upper/lower character and numbers",
    )

    args = parser.parse_args()
    generate(args.length, args.alphanu)
