from src.binance_api.main import main as get_binance_assets
from src.coingecko_api.main import main as get_prices

if __name__ == "__main__":
    binance_assets = get_binance_assets()
    # print(binance_assets)

    # combine all exchange holdings
    asset_holdings = {}
    for asset in [*binance_assets]:

        if asset.symbol not in asset_holdings:
            asset_holdings[asset.symbol] = {asset.exchange: asset}
        else:
            asset_holdings[asset.symbol][asset.exchange] = asset

    # calculate total_amount held
    for asset_holding in asset_holdings:
        asset = asset_holdings[asset_holding]

        asset_sum = 0.0
        for asset_exchange in asset_holdings[asset_holding].keys():

            asset_sum += asset[asset_exchange].amount

        asset_holdings[asset_holding]["total_amount"] = asset_sum

    # calculate total_value in usd
    asset_prices = get_prices(list(asset_holdings.keys()), "usd")
    
    for i, asset_holding in enumerate(asset_holdings):
        asset = asset_holdings[asset_holding]

        asset["price_usd"] = asset_prices[i]["usd"]
        asset["total_value"] = round((asset["total_amount"] * asset["price_usd"]), 2)

    # final portfolio in usd
    total_value = round(sum([asset["total_value"] for asset in asset_holdings.values()]), 2)


    for asset_holding in asset_holdings:
        asset = asset_holdings[asset_holding]

        print(
            asset_holding,
            asset["total_amount"],
            asset["total_value"],
            round(asset["total_value"] / total_value,2),
            total_value
        )
