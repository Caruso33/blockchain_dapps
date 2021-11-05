const db = require("./db.js")
const { Coin } = require("./models.js")

//1. Import coingecko-api
const CoinGecko = require("coingecko-api")

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko()

//3. Make calls
var write = async () => {
  const pages = 1,
    perPage = 250

  const classedCoins = []
  for (let page of Array(pages)
    .fill()
    .map((_x, i) => i)) {
    const { data: coins } = await CoinGeckoClient.coins.markets({
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: perPage,
      page: page,
    })

    for (let coin of coins) {
      let classedCoin = new Coin({
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
        current_price: coin.current_price,
        market_cap: coin.market_cap,
        market_cap_rank: coin.market_cap_rank,
        fully_diluted_valuation: coin.fully_diluted_valuation,
        total_volume: coin.total_volume,
        high_24h: coin.high_24h,
        low_24h: coin.low_24h,
        price_change_24h: coin.price_change_24h,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap_change_24h: coin.market_cap_change_24h,
        market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
        circulating_supply: coin.circulating_supply,
        total_supply: coin.total_supply,
        max_supply: coin.max_supply,
        ath: coin.ath,
        ath_change_percentage: coin.ath_change_percentage,
        ath_date: coin.ath_date,
        atl: coin.atl,
        atl_change_percentage: coin.atl_change_percentage,
        atl_date: coin.atl_date,
        roi: coin.roi,
        last_update: coin.last_updated,
      })

      classedCoins.push(classedCoin)
    }
  }

  for (let coin of classedCoins) {
    db.push(`/coins/${coin.id}`, coin.serialize())
  }
}

async function read() {
  const coins = await db.getData("/coins")

  console.log(`Found ${Object.keys(coins).length} coins.`)

  for (let coin of Object.keys(coins)) {
    const classedCoin = Coin.deserialize(coins[coin])

    // console.log(classedCoin)
  }
}

// write()
read()
