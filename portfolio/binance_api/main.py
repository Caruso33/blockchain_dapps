from dataclasses import dataclass, asdict
import os
from binance.spot import Spot
import dotenv

dotenv.load_dotenv()


@dataclass
class Asset:
    symbol: str
    amount: float

    def __str__(self):
        return f"{self.symbol}, {self.amount}"
        # return asdict(self)


def get_account():
    client = Spot()

    time = client.time()

    client = Spot(
        key=os.environ["binance_key"],
        secret=os.environ["binance_secret"],
    )

    account = client.account()
    balances = account["balances"]

    assets = []
    for balance in balances:
        amount = float(balance["free"]) + float(balance["locked"])
        asset = Asset(balance["asset"], amount)

        if int(asset.amount) > 0:
            assets.append(asset)


if __name__ == "__main__":
    get_account()
