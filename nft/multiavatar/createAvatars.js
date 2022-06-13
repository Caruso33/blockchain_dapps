import multiavatar from "@multiavatar/multiavatar/esm"
import svg2img from "svg2img"
import fs from "fs"
import wordList from "./BIP-0039-word-list.js"

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
function getRandomWord() {
  const randomWord = wordList[Math.floor(Math.random() * wordList.length)]
  return randomWord
}

function generateRandomAvatars() {
  const wordLength = Math.floor(Math.random() * 10) + 1

  const avatarWords = []

  for (let i = 0; i < wordLength - 1; i++) {
    const randomWord = getRandomWord()
    avatarWords.push(randomWord)
  }

  return avatarWords.join(" ")
}

async function main(collectionName = "output", numberOfAvatars = 1) {
  const promises = []

  for (let i = 0; i < numberOfAvatars; i++) {
    const avatarString = generateRandomAvatars()

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

const collectionName = "output"
const numberOfAvatars = 10

main(collectionName, numberOfAvatars)
  .then((svgs) => {
    console.log(`done creating ${svgs.length} avatars`)
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
