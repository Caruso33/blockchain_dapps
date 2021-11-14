from binance.spot import Spot
from .account import get_account_assets


def main():
    client = Spot()

    time = client.time()

    assets = get_account_assets()

    return assets


if __name__ == "__main__":
    main()
