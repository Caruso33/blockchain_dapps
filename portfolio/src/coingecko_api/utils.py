from ..models import Asset


def get_coin_id(coin_list: list[Asset], coin_symbol: str) -> int:

    for c in coin_list:
        if c.symbol.upper() == coin_symbol.upper():
            return c.coingecko_id
    return -1
