from coinbase.wallet.client import Client
import os
import dotenv
from ..models import Asset

dotenv.load_dotenv()


def get_account_assets():

    client = Client(os.environ["coinbase_key"], os.environ["coinbase_secret"])

    accounts = client.get_accounts()

    assets = []
    for balance in accounts["data"]:
        symbol = balance["currency"]

        amount = float(balance["balance"]["amount"])

        exchange = "coinbase"

        asset = Asset(symbol=symbol, amount=amount, exchange=exchange)

        if int(amount * 1e18) > 0:
            assets.append(asset)

    return assets


if __name__ == "__main__":
    assets = get_account_assets()

    print(assets)
