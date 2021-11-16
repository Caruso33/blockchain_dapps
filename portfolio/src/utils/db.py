import json
from os.path import exists


def read_database():
    file_exists = exists("db.json")

    if not file_exists:
        write_database({})

    with open("db.json", "r") as f:
        data = json.load(f)

    return data


def write_database(data):
    with open("db.json", "w") as f:
        json.dump(data, f)


if __name__ == "__main__":
    data = read_database()

    print(data)
