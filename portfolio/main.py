from binance_api.main import get_account_assets as binance_get_account_assets

if __name__ == "__main__":
    binance_assets = binance_get_account_assets()
    print(binance_assets)
