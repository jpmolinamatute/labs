#! /home/juanpa/Projects/labs/server/Python/.venv/bin/python
import random
import time
import string
import pyperclip

allChar = list(f'{string.digits}{string.punctuation}{string.ascii_letters}')
limit1 = int(time.time())
random.seed()
rand1 = random.randint(0, limit1)
random.seed(rand1)

random.shuffle(allChar)
result = random.choices(string.ascii_uppercase, k=2)
result += random.choices(string.ascii_lowercase, k=2)
result += random.choices(string.digits, k=2)
result += random.choices(string.punctuation, k=2)
result += random.choices(allChar, k=2)

random.shuffle(result)
random.shuffle(result)
password = ''.join(result)
print(f'Your new Password is {password} and it was copied to your clipboard')
pyperclip.copy(password)
