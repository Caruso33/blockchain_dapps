const CoinbasePro = require("coinbase-pro")
const { HistoricalTick } = require("./models")
const config = require("../../configs")

class HistoricalService {
  constructor({ product, start, end, interval = 60 }) {
    this.client = new CoinbasePro.PublicClient()

    this.product = product
    this.start = start
    this.end = end
    this.interval = interval
  }

  async getProducts() {
    return this.client.getProducts()
  }

  async getData() {
    console.log("Getting historical data...", this.client)

    const results = await this.client.getProductHistoricRates(this.product, {
      granularity: this.interval,
      start: this.start,
      end: this.end,
    })

    return results.map((result) => new HistoricalTick(...result))
  }
}

module.exports = HistoricalService
