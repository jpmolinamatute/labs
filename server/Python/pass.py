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
pyperclip.copy(''.join(result))
