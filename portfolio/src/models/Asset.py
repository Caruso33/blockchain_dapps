from __future__ import annotations
from dataclasses import dataclass, field, asdict
from typing import Union

from enum import Enum


class AssetType(Enum):
    cryptocurrency = "cryptocurrency"
    cash = "cash"


@dataclass
class Asset:
    symbol: str

    coingecko_id: str = None
    name: str = None

    amount: Union[None, float] = None
    exchange: Union[None, str] = None

    asset_type: str = AssetType.cryptocurrency.value

    @property
    def is_crypto(self):
        return self.asset_type == AssetType.cryptocurrency.value

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
    list: list[Asset] = field(default_factory=list)

    def get_assets_by_symbol(self, symbol: str) -> Asset:
        return list(filter(lambda x: x.symbol == symbol, self.list))

    @property
    def all_symbols_held(self):
        return list(set([asset.symbol for asset in self.list]))

    @property
    def assets_by_symbol(self) -> list[Asset]:
        assets_by_symbol = {}

        for asset in self.list:
            if asset.symbol not in assets_by_symbol:
                assets_by_symbol[asset.symbol] = [asset]
            else:
                assets_by_symbol[asset.symbol].append(asset)

        return assets_by_symbol

    @property
    def assets_by_exchange(self) -> list[Asset]:
        assets_by_exchange = {}

        for asset in self.list:
            if asset.exchange not in assets_by_exchange:
                assets_by_exchange[asset.exchange] = [asset]
            else:
                assets_by_exchange[asset.exchange].append(asset)

        return assets_by_exchange

    @property
    def assets_by_symbol_and_exchange(self) -> list[Asset]:
        assets_by_symbol_and_exchange = {}

        for asset in self.list:
            if asset.symbol not in assets_by_symbol_and_exchange:
                assets_by_symbol_and_exchange[asset.symbol] = {asset.exchange: asset}
            else:
                assets_by_symbol_and_exchange[asset.symbol][asset.exchange] = asset

        return assets_by_symbol_and_exchange

    def calculated_total_values_by_symbol(
        self, asset_prices_by_symbol: dict, vs_currency: str
    ) -> dict:

        assets_total_value = {}

        for asset_symbol in asset_prices_by_symbol.keys():
            asset_price = asset_prices_by_symbol[asset_symbol][vs_currency]
            asset_total_amount = sum(
                [asset.amount for asset in self.assets_by_symbol[asset_symbol]]
            )

            assets_total_value[asset_symbol] = asset_total_amount * asset_price

        assets_total_value["total_value"] = sum(assets_total_value.values())

        return assets_total_value

    def calculated_total_values_by_exchange(
        self, asset_prices_by_symbol: dict, vs_currency: str
    ) -> dict:
        assets_by_exchange = self.assets_by_exchange

        assets_total_value = {}

        for asset_exchange in assets_by_exchange.keys():

            for asset in assets_by_exchange[asset_exchange]:

                asset_price = asset_prices_by_symbol[asset.symbol][vs_currency]

                asset_total_value = asset.amount * asset_price

                if asset_exchange in assets_total_value:
                    assets_total_value[asset_exchange][asset.symbol] = asset_total_value
                else:
                    assets_total_value[asset_exchange] = {
                        asset.symbol: asset_total_value
                    }

        for asset_exchange in assets_by_exchange.keys():
            assets_total_value[asset_exchange]["total_value"] = sum(
                asset_total_value
                for asset_total_value in assets_total_value[asset_exchange].values()
            )

        assets_total_value["total_value"] = sum(
            [
                exchange_assets["total_value"]
                for exchange_assets in assets_total_value.values()
            ]
        )

        return assets_total_value

    def ignore_symbols(self, ignored_symbols: list[str]) -> Assets:
        self.list = list(
            filter(lambda asset: asset.symbol not in ignored_symbols, self.list)
        )

        return self

    def serialize(self) -> list[dict]:
        return [asset.serialize() for asset in self.list]

    @classmethod
    def deserialize(self, data: list[dict]) -> Assets:
        assets = [Asset.deserialize(asset) for asset in data]
        return Assets(assets=assets)
