import os

import dotenv
from kucoin.client import Client

from ..models import Asset

dotenv.load_dotenv()


def get_account_assets():

    client = Client(
        os.environ["kucoin_key"],
        os.environ["kucoin_secret"],
        os.environ["kucoin_passphrase"],
    )

    balances = client.get_accounts()

    assets = []
    for balance in balances:
        symbol = balance["currency"]
        amount = float(balance["balance"])
        exchange = "kucoin"

        asset = Asset(symbol=symbol, amount=amount, exchange=exchange)

        if int(amount * 1e18) > 0:
            assets.append(asset)

    return assets


if __name__ == "__main__":
    assets = get_account_assets()

    print(assets)
