from __future__ import annotations
from dataclasses import dataclass, field, asdict
from typing import Union


@dataclass
class Asset:
    symbol: str

    coingecko_id: str = None
    name: str = None

    amount: Union[None, float] = None
    exchange: Union[None, str] = None

    markets: list[dict] = field(default_factory=list)

    # @property
    # def price_usd(self) -> Union[None, float]:
    #     # TODO:
    #     # actually should be any stablecoin relation
    #     if not "USDT" in [x.quote_asset for x in self.price_pairs]:
    #         return None

    #     usdt_price_pair = next(
    #         (x for x in self.price_pairs if x.quote_asset == "USDT"), None
    #     )
    #     return self.amount *

    def serialize(self) -> dict:
        return asdict(self)

    @classmethod
    def deserialize(self, data: dict) -> Asset:

        coin = Asset(
            symbol=data["symbol"], coingecko_id=data["coingecko_id"], name=data["name"]
        )

        return coin

@dataclass
class Assets:
    assets: list[Asset] = field(default_factory=list)

    def get_assets_by_symbol(self, symbol: str) -> Asset:
        return list(filter(lambda x: x.symbol == symbol, self.assets))

    @property
    def all_symbols_held(self):
        return list(set([asset.symbol for asset in self.assets]))

    @property
    def assets_by_symbol(self) -> list[Asset]:
        assets_by_symbol = {}

        for asset in self.assets: 
            if asset.symbol not in assets_by_symbol:
                assets_by_symbol[asset.symbol] = [asset]
            else:
                assets_by_symbol[asset.symbol].append(asset)

        return assets_by_symbol

    @property
    def assets_by_exchange(self) -> list[Asset]:
        assets_by_exchange = {}

        for asset in self.assets: 
            if asset.exchange not in assets_by_exchange:
                assets_by_exchange[asset.exchange] = [asset]
            else:
                assets_by_exchange[asset.exchange].append(asset)

        return assets_by_exchange

    @property
    def assets_by_symbol_and_exchange(self) -> list[Asset]:
        assets_by_symbol_and_exchange = {}

        for asset in self.assets: 
            if asset.symbol not in assets_by_symbol_and_exchange:
                assets_by_symbol_and_exchange[asset.symbol] = {asset.exchange: asset}
            else:
                assets_by_symbol_and_exchange[asset.symbol][asset.exchange] = asset

        return assets_by_symbol_and_exchange


    def calculated_total_values(self, asset_prices_by_symbol: dict, vs_currency: str) -> dict:
        # total_amount_by_symbol = self.total_amount_by_symbol
        assets_by_exchange = self.assets_by_exchange

        assets_total_value = {}
        # by symbol
        for asset_symbol in asset_prices_by_symbol.keys():
            asset_price = asset_prices_by_symbol[asset_symbol][vs_currency]
            asset_total_amount = sum([asset.amount for asset in self.assets_by_symbol[asset_symbol]])            

            assets_total_value[asset_symbol] = asset_total_amount * asset_price

        assets_total_value["total_value"] = sum(assets_total_value.values())

        # by exchange
        for asset_exchange in assets_by_exchange.keys():
            assets = assets_by_exchange[asset_exchange]

            for asset in assets:
                
                asset_price = asset_prices_by_symbol[asset.symbol][vs_currency]

                asset_total_value = asset.amount * asset_price

                if asset_exchange in assets_total_value:
                    assets_total_value[asset_exchange][asset.symbol] = asset_total_value
                else:
                    assets_total_value[asset_exchange] = {asset.symbol: asset_total_value}

        for asset_exchange in assets_by_exchange.keys():
            assets = assets_by_exchange[asset_exchange]

            assets_total_value[asset_exchange]["total_value"] = sum(asset_total_value for asset_total_value in assets_total_value[asset_exchange].values())
        

        return assets_total_value


    def serialize(self) -> list[dict]:
        return [asset.serialize() for asset in self.assets]

    @classmethod
    def deserialize(self, data: list[dict]) -> Assets:
        assets = [Asset.deserialize(asset) for asset in data]
        return Assets(assets=assets)