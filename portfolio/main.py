from src.binance_api.main import main as get_binance_assets
from src.coingecko_api.main import main as get_prices
from src.models import Assets

if __name__ == "__main__":
    binance_assets = get_binance_assets()
    # print(binance_assets)

    # combine all exchange holdings
    assets = Assets([*binance_assets])

    asset_holdings = assets.assets_by_symbol_and_exchange
    asset_prices = get_prices(list(asset_holdings.keys()), "usd")


    asset_total_value = assets.calculated_total_values(asset_prices, "usd")

    print(asset_total_value)


    for asset_holding in asset_holdings:
        asset = asset_holdings[asset_holding]

        print(
            asset_holding,
            asset["total_amount"],
            asset["total_value"],
            round(asset["total_value"] / total_value,2),
            total_value
        )
