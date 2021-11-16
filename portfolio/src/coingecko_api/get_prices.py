from pycoingecko import CoinGeckoAPI


def get_prices(ids, vs_currencies="usd"):
    cg = CoinGeckoAPI()

    prices = cg.get_price(ids=ids, vs_currencies=vs_currencies)

    return prices
