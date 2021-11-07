class Coin {
  constructor({
    id,
    symbol,
    name,
    image,
    current_price,
    market_cap,
    market_cap_rank,
    fully_diluted_valuation,
    total_volume,
    high_24h,
    low_24h,
    price_change_24h,
    price_change_percentage_24h,
    market_cap_change_24h,
    market_cap_change_percentage_24h,
    circulating_supply,
    total_supply,
    max_supply,
    ath,
    ath_change_percentage,
    ath_date,
    atl,
    atl_change_percentage,
    atl_date,
    roi,
    last_updated,
  }) {
    this.id = id
    this.symbol = symbol
    this.name = name
    this.image = image
    this.current_price = current_price
    this.market_cap = market_cap
    this.market_cap_rank = market_cap_rank
    this.fully_diluted_valuation = fully_diluted_valuation
    this.total_volume = total_volume
    this.high_24h = high_24h
    this.low_24h = low_24h
    this.price_change_24h = price_change_24h
    this.price_change_percentage_24h = price_change_percentage_24h
    this.market_cap_change_24h = market_cap_change_24h
    this.market_cap_change_percentage_24h = market_cap_change_percentage_24h
    this.circulating_supply = circulating_supply
    this.total_supply = total_supply
    this.max_supply = max_supply
    this.ath = ath
    this.ath_change_percentage = ath_change_percentage
    this.ath_date = ath_date
    this.atl = atl
    this.atl_change_percentage = atl_change_percentage
    this.atl_date = atl_date
    this.roi = roi
    this.last_updated = last_updated
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      symbol: this.symbol,
      name: this.name,
      image: this.image,
      current_price: this.current_price,
      market_cap: this.market_cap,
      market_cap_rank: this.market_cap_rank,
      fully_diluted_valuation: this.fully_diluted_valuation,
      total_volume: this.total_volume,
      high_24h: this.high_24h,
      low_24h: this.low_24h,
      price_change_24h: this.price_change_24h,
      price_change_percentage_24h: this.price_change_percentage_24h,
      market_cap_change_24h: this.market_cap_change_24h,
      market_cap_change_percentage_24h: this.market_cap_change_percentage_24h,
      circulating_supply: this.circulating_supply,
      total_supply: this.total_supply,
      max_supply: this.max_supply,
      ath: this.ath,
      ath_change_percentage: this.ath_change_percentage,
      ath_date: this.ath_date,
      atl: this.atl,
      atl_change_percentage: this.atl_change_percentage,
      atl_date: this.atl_date,
      roi: this.roi,
      last_updated: this.last_updated,
    })
  }

  static deserialize(json) {
    const {
      id,
      symbol,
      name,
      image,
      current_price,
      market_cap,
      market_cap_rank,
      fully_diluted_valuation,
      total_volume,
      high_24h,
      low_24h,
      price_change_24h,
      price_change_percentage_24h,
      market_cap_change_24h,
      market_cap_change_percentage_24h,
      circulating_supply,
      total_supply,
      max_supply,
      ath,
      ath_change_percentage,
      ath_date,
      atl,
      atl_change_percentage,
      atl_date,
      roi,
      last_updated,
    } = JSON.parse(json)

    return new Coin({
      id,
      symbol,
      name,
      image,
      current_price,
      market_cap,
      market_cap_rank,
      fully_diluted_valuation,
      total_volume,
      high_24h,
      low_24h,
      price_change_24h,
      price_change_percentage_24h,
      market_cap_change_24h,
      market_cap_change_percentage_24h,
      circulating_supply,
      total_supply,
      max_supply,
      ath,
      ath_change_percentage,
      ath_date,
      atl,
      atl_change_percentage,
      atl_date,
      roi,
      last_updated,
    })
  }
}

module.exports = { Coin }
