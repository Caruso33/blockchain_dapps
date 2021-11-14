import os

import dotenv
from binance.spot import Spot
from binance.error import ClientError
from .models import ExchangeSymbol

dotenv.load_dotenv()


def get_exchange_symbols():
    client = Spot(
        key=os.environ["binance_key"],
        secret=os.environ["binance_secret"],
    )

    exchange_info = client.exchange_info()

    exchange_symbols = []
    for symbol in exchange_info["symbols"]:
        exchange_symbol = ExchangeSymbol(
            symbol["symbol"],
            symbol["status"],
            symbol["baseAsset"],
            symbol["baseAssetPrecision"],
            symbol["quoteAsset"],
            symbol["quotePrecision"],
            symbol["quoteAssetPrecision"],
        )
        exchange_symbols.append(exchange_symbol)

    return exchange_symbols


if __name__ == "__main__":
    exchange_symbols = get_exchange_symbols()

    # print(exchange_symbols)

    for symbol in exchange_symbols:
        print(symbol)
        symbols_as_base = filter(
            lambda x: x.base_asset == symbol.base_asset, exchange_symbols
        )

        if "USDT" not in [x.quote_asset for x in symbols_as_base]:
            print(f"{symbol.symbol}!!!!!!!!!!!!!!!!!")
            break
