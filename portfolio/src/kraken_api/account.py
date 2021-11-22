import krakenex

import os

import dotenv


from ..models import Asset

dotenv.load_dotenv()


cashCurrencies = ["ZAUD", "ZCAD", "ZCHF", "ZEUR", "ZGBP"]
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

        if symbol in [*cashCurrencies, *oldCryptoCurrencies]:
            symbol = symbol[1:]

        amount = float(balances[balance])
        exchange = "kraken"

        asset = Asset(symbol=symbol, amount=amount, exchange=exchange)

        if symbol in cashCurrencies:
            asset.asset_type = Asset.AssetType.cash.value

        if int(amount * 1e18) > 0:
            assets.append(asset)

    return assets


if __name__ == "__main__":
    assets = get_account_assets()

    print(assets)
