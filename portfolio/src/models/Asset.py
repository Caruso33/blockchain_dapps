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
