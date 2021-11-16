from __future__ import annotations
from dataclasses import dataclass, asdict


@dataclass
class Coin:
    id: str
    symbol: str
    name: str

    def serialize(self) -> dict:
        return asdict(self)

    @classmethod
    def deserialize(self, data: dict) -> Coin:

        coin = Coin(data["id"], data["symbol"], data["name"])

        return coin
