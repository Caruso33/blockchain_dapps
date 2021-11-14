import os

import dotenv
from binance.spot import Spot
from binance.error import ClientError
from .models import Asset

dotenv.load_dotenv()


def get_asset_price_usd(client, asset, btc_price, eth_price):
    match asset.symbol:
        case "USDT": 
            return ("USDT", asset.amount)
        case "BTC":
            return ("USDT", asset.amount * btc_price)
        case "ETH":
            return ("USDT", asset.amount * eth_price)
        case _:
            pass


    try:
        market = client.avg_price(f"{asset.symbol}USDT")
        price = float(market["price"])

        return ("USDT", asset.amount * price)

    except ClientError as e:
        try:
            market = client.avg_price(f"{asset.symbol}BTC")
            price = float(market["price"]) * btc_price

            return ("BTC", asset.amount * price * btc_price)

        except ClientError as e:
            try:
                market = client.avg_price(f"{asset.symbol}ETH")
                price = float(market["price"]) * eth_price

                return ("ETH", asset.amount * price * eth_price)

            except ClientError as e:
                raise ValueError(
                    f"An error occurred, can't find asset_price for {asset.symbol}: {e.error_message}"
                )


def get_market_data(assets: list[Asset]):
    client = Spot(
        key=os.environ["binance_key"],
        secret=os.environ["binance_secret"],
    )

    btc_market, eth_market = client.avg_price("BTCUSDT"), client.avg_price("ETHUSDT")
    btc_price, eth_price = float(btc_market["price"]), float(eth_market["price"])

    for asset in assets:
        (pair_symbol, price_in_usd) = get_asset_price_usd(client, asset, btc_price, eth_price)
        
        asset.pair_symbol = pair_symbol
        asset.price_usd = price_in_usd
        print(asset)


if __name__ == "__main__":
    assets = [
        Asset("BTC", 0.1),
        Asset("ETH", 5),
        Asset("USDT", 10),
        Asset("XRP", 100),
    ]

    try:
        assets = get_market_data(assets)
        print(assets)
    except ClientError as e:
        print(e.error_message)
