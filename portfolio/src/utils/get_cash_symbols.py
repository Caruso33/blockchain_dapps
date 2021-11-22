import dotenv
import os

dotenv.load_dotenv()


def get_cash_symbols():

    cash_symbols = os.environ["cash_symbols"]
    cash_symbols = cash_symbols.split(",")

    return [symbol_usd_value[0] for symbol_usd_value in cash_symbols]


def get_cash_symbols_against_usd() -> list:

    cash_symbols_against_usd = os.environ["cash_symbols_against_usd"]
    cash_symbols_against_usd = cash_symbols_against_usd.split(",")

    return {
        symbol_usd_value[0]: symbol_usd_value[1]
        for symbol_usd_value in cash_symbols_against_usd
    }
