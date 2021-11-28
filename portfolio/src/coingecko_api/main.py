from typing import Union

from ..models.Asset import Assets

from .utils import get_coin_id
from .coin_list import get_asset_list
from .get_prices import get_prices


def main(assets: Assets, vs_currencies: Union[None, str]) -> dict:

    asset_list = get_asset_list()

    symbol_ids = [
        get_coin_id(
            asset_list,
            asset.symbol
            if asset.is_crypto
            else f"{asset.symbol}T",  # use tether for cash symbols
        )
        for asset in assets.list
    ]

    if any([id == -1 for i, id in enumerate(symbol_ids)]):
        idxs = [symbol_ids.index(id) for id in symbol_ids if id == -1]

        raise ValueError(
            f"One or more symbols not found in asset list {[assets.list[idx] for idx in idxs]}"
        )

    symbol_prices = get_prices(symbol_ids, vs_currencies)

    prices = {}
    for symbol_i, symbol_id in enumerate(symbol_ids):
        asset = assets.list[symbol_i]
        price = symbol_prices[symbol_id]

        prices[asset.symbol] = price

    return prices


if __name__ == "__main__":
    prices = main(["btc", "eth", "xrp"], "usd,eur")

    print(prices)
