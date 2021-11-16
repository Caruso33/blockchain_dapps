from typing import Union
from .utils import get_coin_id
from .coin_list import get_asset_list
from .get_prices import get_prices


def main(symbols: list[str], vs_currencies: Union[None, str]) -> dict:
    if not isinstance(symbols, list):
        raise TypeError(f"Symbols must be a list, is {type(symbols)}")

    asset_list = get_asset_list()

    symbol_ids = [get_coin_id(asset_list, symbol) for symbol in symbols]

    if any(id == -1 for id in symbol_ids):
        idxs = [symbol_ids.index(id) for id in symbol_ids if id == -1]
        raise ValueError(
            f"One or more symbols not found in asset list {[symbols[idx] for idx in idxs]}"
        )

    symbol_prices = get_prices(symbol_ids, vs_currencies)

    prices = []
    for symbol_id in symbol_ids:
        prices.append(symbol_prices[symbol_id])

    return prices


if __name__ == "__main__":
    prices = main(["btc", "eth", "xrp"], "usd,eur")

    print(prices)
