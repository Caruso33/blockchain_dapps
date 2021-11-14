from dataclasses import dataclass


@dataclass
class Asset:
    symbol: str
    amount: float
