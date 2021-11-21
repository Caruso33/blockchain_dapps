import os

import dotenv
from binance.spot import Spot

from ..models import Asset

dotenv.load_dotenv()


def get_account_assets():

    client = Spot(
        key=os.environ["binance_key"],
        secret=os.environ["binance_secret"],
    )

    account = client.account()
    balances = account["balances"]

    assets = []
    for balance in balances:
        symbol = balance["asset"]
        amount = float(balance["free"]) + float(balance["locked"])
        exchange = "binance"

        asset = Asset(symbol=symbol, amount=amount, exchange=exchange)

        if int(asset.amount * 1e18) > 0:
            assets.append(asset)

    return assets


if __name__ == "__main__":
    get_account_assets()
