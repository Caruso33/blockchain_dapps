from .models import Coin


def get_coin_id(coin_list: list[Coin], coin_symbol: str) -> int:

    for c in coin_list:
        if c.symbol == coin_symbol:
            return c.id
    return -1
