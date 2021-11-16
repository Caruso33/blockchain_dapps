from .utils import get_coin_id
from .coin_list import get_asset_list
from .get_price import get_price


def main():
    asset_list = get_asset_list()

    return asset_list


if __name__ == "__main__":
    asset_list = main()

    id = get_coin_id(asset_list, "btc")
    if id != -1:
        price = get_price(id)
        print(price)
