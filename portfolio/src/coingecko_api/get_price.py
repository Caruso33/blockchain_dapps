from pycoingecko import CoinGeckoAPI


def get_price(ids):
    cg = CoinGeckoAPI()

    price = cg.get_price(ids=ids, vs_currencies="usd")

    return price
