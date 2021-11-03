const { program } = require("commander")
const config = require("./configs")
const HistoricalService = require("./src/historical")

const now = new Date()
const yesterday = new Date(now - 24 * 60 * 60 * 1000)

const toDate = (value) => new Date(value * 1e3)

program.version("1.0.0")

program
  .option(
    "-i, --interval [interval]",
    "Interval",
    (value) => parseInt(value),
    300
  )
  .option("-p, --product [product]", "Product to trade", "BTC-USD")
  .option(
    "-s, --start [start]",
    "Start time in unix seconds",
    toDate,
    yesterday
  )
  .option("-e, --end [end]", "End time in unix seconds", toDate, now)
//   .option("-s, --side", "Side to trade", "buy")
//   .option("-a, --amount", "Amount to trade", "1")
//   .option("-t, --type", "Type of order", "limit")
//   .option("-o, --order", "Order type", "market")
//   .option("-l, --limit", "Limit price", "0.01")
//   .option("-c, --client", "Client", "gdax")

program.parse(process.argv)

// const key = config.get("GDAX_API_KEY")
// const secret = config.get("GDAX_API_SECRET")
// const passphrase = config.get("GDAX_API_PASSPHRASE")
// const apiUrl = config.get("GDAX_API_URL")

// const authedclient = new gdax.AuthenticatedClient(key, secret, passphrase, apiUrl)

const main = async () => {
  const options = program.opts()

  const { interval, product, start, end } = options
  console.log(interval, product, start, end)

  try {
    const service = new HistoricalService({ product, start, end, interval })
    const ticks = await service.getData()

    console.log(ticks[ticks.length - 1])

    // const products = await service.getProducts()
    // console.log(products)
  } catch (e) {
    console.error(e.message)
  }
}

main()
