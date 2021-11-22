import os

from src.binance_api.main import main as get_binance_assets
from src.kucoin_api.main import main as get_kucoin_assets
from src.kraken_api.main import main as get_kraken_assets
from src.coingecko_api.main import main as get_prices
from src.models import Assets

if __name__ == "__main__":
    binance_assets = get_binance_assets()
    kucoin_assets = get_kucoin_assets()
    kraken_assets = get_kraken_assets()

    total_assets = [*binance_assets, *kucoin_assets, *kraken_assets]

    assets = Assets(total_assets)

    ignored_symbols = os.environ["ignored_symbols"].split(",")
    assets = assets.ignore_symbols(ignored_symbols)

    asset_holdings = assets.assets_by_symbol_and_exchange

    asset_prices = get_prices(list(asset_holdings.keys()), "usd")
    print(asset_prices)

    asset_total_value_by_symbol = assets.calculated_total_values_by_symbol(
        asset_prices, "usd"
    )
    asset_total_value_by_exchange = assets.calculated_total_values_by_exchange(
        asset_prices, "usd"
    )

    print("Assets by symbol: ", asset_total_value_by_symbol)
    print()
    print()
    print()
    print("Assets by exchange: ", asset_total_value_by_exchange)
