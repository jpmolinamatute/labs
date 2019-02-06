
class SimpleClass():
    def __init__(self):
        print("hello")

    def yell(self):
        print("Yelling!")


class ExtendedClass(SimpleClass):
    def __init__(self):
        super().__init__()
        print("Exteded")


s = "World"
x = SimpleClass()
y = ExtendedClass()
