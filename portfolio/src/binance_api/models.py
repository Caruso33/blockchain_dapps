from dataclasses import dataclass, field
from typing import Union


@dataclass
class QuoteAsset:
    symbol: str
    price_usd: float


@dataclass
class Asset:
    symbol: str
    amount: float
    price_pairs: field(default_factory=list)

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


@dataclass
class ExchangeSymbol:
    symbol: str
    status: str
    base_asset: str
    base_asset_precision: int
    quote_asset: str
    quote_precision: int
    quote_asset_precision: int
