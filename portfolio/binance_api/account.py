import os

import dotenv
from binance.spot import Spot

from .models import Asset

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
        amount = float(balance["free"]) + float(balance["locked"])
        asset = Asset(balance["asset"], amount)

        if int(asset.amount) > 0:
            assets.append(asset)

    return assets
