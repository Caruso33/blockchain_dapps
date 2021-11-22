import os
from typing import Union
from .utils import get_coin_id
from .coin_list import get_asset_list
from .get_prices import get_prices

def get_cash_symbols_against_usd() -> list:
    
    cash_symbols_against_usd = os.environ["cash_symbols_against_usd"]
    cash_symbols_against_usd = cash_symbols_against_usd.split(",")
    cash_symbols_against_usd = [
        symbol_usd_value.split("=") for symbol_usd_value in cash_symbols_against_usd
    ]

    return cash_symbols_against_usd


def main(symbols: list[str], vs_currencies: Union[None, str]) -> dict:
    if not isinstance(symbols, list):
        raise TypeError(f"Symbols must be a list, is {type(symbols)}")

    cash_symbols_against_usd = get_cash_symbols_against_usd()

    asset_list = get_asset_list()

    symbols_without_cash = [symbol for symbol in symbols if symbol not in [symbol_usd_value[0] for symbol_usd_value in cash_symbols_against_usd]]

    symbol_ids = [get_coin_id(asset_list, symbol) for symbol in symbols_without_cash]


    if any(
        [
            id == -1
            for i, id in enumerate(symbol_ids)
        ]
    ):
        idxs = [symbol_ids.index(id) for id in symbol_ids if id == -1]

        raise ValueError(
            f"One or more symbols not found in asset list {[symbols[idx] for idx in idxs]}"
        )

    symbol_prices = get_prices(symbol_ids, vs_currencies)

    prices = {}
    for symbol_i, symbol_id in enumerate(symbol_ids):
        symbol = symbols[symbol_i]
        price = symbol_prices[symbol_id]

        prices[symbol] = price

        if symbol == "USD":
            prices[symbol] = {"usd": 1.0}
        elif symbol == "EUR":
            prices[symbol] = {"usd": float(os.environ["eurusd"])}

    return prices


if __name__ == "__main__":
    prices = main(["btc", "eth", "xrp"], "usd,eur")

    print(prices)
