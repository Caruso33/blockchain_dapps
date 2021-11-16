from dataclasses import dataclass


@dataclass
class ExchangeSymbol:
    symbol: str
    status: str
    base_asset: str
    base_asset_precision: int
    quote_asset: str
    quote_precision: int
    quote_asset_precision: int
