from pycoingecko import CoinGeckoAPI
from .utils import get_coin_id
from .models import Coin
from ..utils import db


def get_coins_list():
    cg = CoinGeckoAPI()

    coins_list = cg.get_coins_list()

    coins = []
    for coin in coins_list:
        coins.append(Coin(coin["id"], coin["symbol"], coin["name"]))

    return coins


def get_price(ids):
    cg = CoinGeckoAPI()

    price = cg.get_price(ids=ids, vs_currencies="usd")

    return price


if __name__ == "__main__":

    data = db.read_database()

    if not "coins_list" in data:
        coins_list = get_coins_list()

        data["coins_list"] = [c.serialize() for c in coins_list]

        db.write_database(data)

    else:
        coins_list = data["coins_list"]

        coins_list = [Coin.deserialize(x) for x in data["coins_list"]]

    id = get_coin_id(coins_list, "btc")
    if id != -1:
        price = get_price(id)
        print(price)
