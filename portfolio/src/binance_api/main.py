from binance.spot import Spot
from .account import get_account_assets
from .market import get_market_data


def main():
    client = Spot()

    time = client.time()

    assets = get_account_assets()

    print("LALA", assets)

    assets = get_market_data(assets)

    return assets


if __name__ == "__main__":
    main()
