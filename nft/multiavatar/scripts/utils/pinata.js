require("dotenv").config()

const pinata_key = process.env.PINATA_KEY
const pinata_secret = process.env.PINATA_SECRET

const pinataSDK = require("@pinata/sdk")
const pinata = pinataSDK(pinata_key, pinata_secret)

module.exports = pinata
