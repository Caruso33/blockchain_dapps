from pycoingecko import CoinGeckoAPI
from dataclasses import dataclass

@dataclass
class Coin:
    id: str
    symbol: str
    name: str


def get_coins_list(cg):
    coins_list = cg.get_coins_list()

    coins = []
    for coin in coins_list:
        coins.append(Coin(coin['id'], coin['symbol'], coin['name']))

    return coins

def get_coin_id(coin_list: list[Coin], coin_symbol: str) -> int:

    for c in coin_list:
        if c.symbol == coin_symbol:
            return c.id
    return -1


def get_price(cg, ids):


    price = cg.get_price(ids=ids, vs_currencies='usd')

    return price

if __name__ == '__main__':
    cg = CoinGeckoAPI()

    coins_list = get_coins_list(cg)

    id = get_coin_id(coins_list)
    if id != -1:
        price = get_price(cg, id)
        print(price)