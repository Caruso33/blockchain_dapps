from dataclasses import dataclass


@dataclass
class Asset:
    symbol: str
    amount: float
    pair_symbol: str = None
    price_usd: float = None


@dataclass
class ExchangeSymbol:
    symbol: str
    status: str
    baseAsset: str
    baseAssetPrecision: int
    quoteAsset: str
    quotePrecision: int
    quoteAssetPrecision: int
