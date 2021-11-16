from src.binance_api.main import main as get_binance_assets
from src.coingecko_api.main import main as get_asset_list, get_price

if __name__ == "__main__":
    asset_list = get_asset_list()

    binance_assets = get_binance_assets()
    # print(binance_assets)

    asset_holdings = {}
    for asset in [*binance_assets]:

        if asset.symbol not in asset_holdings:
            asset_holdings[asset.symbol] = {asset.exchange: asset}
        else:
            asset_holdings[asset.symbol][asset.exchange] = asset

    for asset_holding in asset_holdings:
        asset = asset_holdings[asset_holding]

        asset_sum = 0.0
        for asset_exchange in asset_holdings[asset_holding].keys():

            asset_sum += asset_holdings[asset_holding][asset_exchange].amount

        asset_holdings[asset_holding]["total"] = asset_sum

    print(asset_holdings)
