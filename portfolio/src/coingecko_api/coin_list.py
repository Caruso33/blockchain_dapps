from pycoingecko import CoinGeckoAPI
from ..utils import db
from ..models import Asset


def request_coin_list():
    cg = CoinGeckoAPI()

    coins_list = cg.get_coins_list()

    coins = []
    for coin in coins_list:
        coins.append(
            Asset(
                symbol=coin["symbol"].upper(),
                coingecko_id=coin["id"],
                name=coin["name"],
            )
        )

    return coins


def get_asset_list():
    data = db.read_database()

    if not "coins_list" in data:
        coins_list = request_coin_list()

        data["coins_list"] = [c.serialize() for c in coins_list]

        db.write_database(data)

    else:
        coins_list = data["coins_list"]

        coins_list = [Asset.deserialize(x) for x in data["coins_list"]]

    return coins_list
