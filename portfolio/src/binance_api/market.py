import os

import dotenv
from binance.spot import Spot
from binance.error import ClientError
from .models import QuoteAsset, Asset, ExchangeSymbol

dotenv.load_dotenv()


def get_asset_price_usd(client, asset):
    try:
        market = client.avg_price(f"{asset.symbol}USDT")
        price = float(market["price"])

        return asset.amount * price

    except ClientError as e:
        raise ValueError(
            f"An error occurred, can't find asset price for {asset.symbol}: {e.error_message}"
        )


def get_market_data(assets: list[Asset], exchange_symbols: list[ExchangeSymbol]):
    client = Spot(
        key=os.environ["binance_key"],
        secret=os.environ["binance_secret"],
    )

    applied_quote_assets = [QuoteAsset("USDT", 1)]

    for asset in assets:
        quote_exchange_symbols = filter(
            lambda x: asset.symbol == x.base_asset, exchange_symbols
        )
        
        for quote_exchange_symbol in quote_exchange_symbols:
            if quote_exchange_symbol.quote_asset in [x.symbol for x in applied_quote_assets]:
                continue

            quote_asset = quote_exchange_symbol.quote_asset
            quote_market = client.avg_price(f"{quote_asset}USDT")
            quote_price = float(quote_market["price"])

            applied_quote_assets.append(QuoteAsset(quote_asset, quote_price))


        quote_asset = next(
            (
                x
                for x in quote_exchange_symbols
                if x.symbol in [y.symbol for y in applied_quote_assets]
            ),
            None,
        )

        if not quote_asset:
            next_quote_symbol = None

            if "BTC" in [x.symbol for x in quote_exchange_symbols]:
                next_quote_symbol = "BTC"
            elif "ETH" in [x.symbol for x in quote_exchange_symbols]:
                next_quote_symbol = "ETH"
            else:
                next_quote_symbol = quote_exchange_symbols[0].symbol

            try:
                get_asset_price_usd(client, Asset(next_quote_symbol.symbol, asset.))
                market = client.avg_price(f"{next_quote_symbol}USDT")
                price = float(market["price"])
            except ClientError as e:
                raise ValueError(
                    f"An error occurred, can't find asset price for {next_quote_symbol}USDT: {e.error_message}"
                )

            

            applied_quote_assets.append()
            (pair_symbol, price_in_usd) = get_asset_price_usd(client, asset)

        asset.pair_symbol = pair_symbol
        asset.price_usd = price_in_usd
        print(asset)


if __name__ == "__main__":
    assets = [
        Asset("BTC", 0.1),
        Asset("ETH", 5),
        Asset("USDT", 10),
        Asset("XRP", 100),
        Asset("SNT", 1),
    ]

    try:
        assets = get_market_data(assets)
        print(assets)
    except ClientError as e:
        print(e.error_message)
