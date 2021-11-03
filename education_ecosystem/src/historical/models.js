class HistoricalTick {
  constructor(time, low, high, open, close, volume) {
    this.time = time
    this.low = low
    this.high = high
    this.open = open
    this.close = close
    this.volume = volume
  }
}

module.exports = { HistoricalTick }
