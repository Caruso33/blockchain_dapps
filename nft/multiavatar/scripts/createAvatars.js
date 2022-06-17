const { faker } = require("@faker-js/faker")
const multiavatar = require("@multiavatar/multiavatar")
const fs = require("fs")
const svg2img = require("svg2img")

function createSvg(string = "Binx Bond") {
  const svgCode = multiavatar(string)

  return svgCode
}

async function saveSvgToImg(svgCode, outputPath) {
  return new Promise((resolve, reject) => {
    svg2img(svgCode, function (error, buffer) {
      if (error) {
        reject(error)
      }

      fs.writeFileSync(outputPath, buffer)
      resolve()
    })
  })
}

async function createAvatars(collectionName = "output", numberOfAvatars = 1) {
  const promises = []

  for (let i = 0; i < numberOfAvatars; i++) {
    const avatarString = faker.name.findName()

    const svgCode = createSvg(avatarString)

    if (!fs.existsSync(collectionName)) {
      fs.mkdirSync(collectionName)
    }

    const svgPromise = saveSvgToImg(
      svgCode,
      `${collectionName}/${avatarString.replaceAll(" ", "_")}.png`
    )
    promises.push(svgPromise)
  }

  return Promise.all(promises)
}

module.exports = createAvatars
