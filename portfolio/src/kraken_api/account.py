import krakenex

import os

import dotenv


from ..models import Asset, AssetType

dotenv.load_dotenv()


cashCurrencies = ["ZAUD", "ZCAD", "ZCHF", "ZEUR", "ZGBP", "ZUSD"]
oldCryptoCurrencies = [
    "XETC",
    "XETH",
    "XLTC",
    "XMLN",
    "XREP",
    "XREPV2",
    "XXBT",
    "XXDG",
    "XXLM",
    "XXMR",
    "XXRP",
    "XXTZ",
    "XZEC",
]


def get_account_assets():

    client = krakenex.API(
        key=os.environ["kraken_key"],
        secret=os.environ["kraken_secret"],
    )

    balances = balance = client.query_private("Balance")["result"]

    assets = []
    for balance in balances:
        symbol = balance
        asset_type = AssetType.cryptocurrency.value

        if symbol in [*cashCurrencies, *oldCryptoCurrencies]:
            if symbol in cashCurrencies:
                asset_type = AssetType.cash.value

            symbol = symbol[1:]

        # bitcoin kraken ticker is an exception
        if symbol == "XBT":
            symbol = "BTC"

        amount = float(balances[balance])
        exchange = "kraken"

        asset = Asset(
            symbol=symbol, amount=amount, exchange=exchange, asset_type=asset_type
        )

        if int(amount * 1e18) > 0:
            assets.append(asset)

    return assets


if __name__ == "__main__":
    assets = get_account_assets()

    print(assets)
