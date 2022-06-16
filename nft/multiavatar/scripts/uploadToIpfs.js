const pinata = require("./utils/pinata")
const fs = require("fs")
// const { create: ipfsHttpClient } = require("ipfs-http-client")

// const client = ipfsHttpClient({ url: "https://ipfs.infura.io:5001/api/v0" })

function readFiles(dirname, onFileContent, onError) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, function (err, filenames) {
      if (err) {
        onError(err)
        return
      }

      let hasError = false
      filenames = filenames.filter(
        (filename) =>
          filename.endsWith(".jpeg") ||
          filename.endsWith(".jpg") ||
          filename.endsWith(".png")
      )

      filenames.forEach(function (filename) {
        fs.readFile(dirname + "/" + filename, "utf-8", function (err, content) {
          if (err) {
            if (onError) onError(err)
            hasError = true
            return
          }

          if (onFileContent) onFileContent(filename, content)
        })
      })

      if (hasError) reject(hasError)
      if (!hasError) resolve(filenames)
    })
  })
}

function uploadFileToIpfs(dirpath, filenames) {
  const promises = []
  for (const filename of filenames) {
    const readableStreamForFile = fs.createReadStream(dirpath + "/" + filename)
    const options = {
      pinataMetadata: {
        name: filename,
        // keyvalues: {
        //     customKey: 'customValue',
        //     customKey2: 'customValue2'
        // }
      },
      pinataOptions: {
        cidVersion: 0,
      },
    }

    const uploadPromise = pinata.pinFileToIPFS(readableStreamForFile, options)
    promises.push(uploadPromise)
  }

  return Promise.all(promises)
}

function uploadMetaDataToIpfs(filenames, uploadedFiles) {
  const gatewayUrl = "https://gateway.pinata.cloud/ipfs/"

  const promises = []

  for (const [i, filename] of filenames.entries()) {
    const shortName = filename.split(".")[0]

    const metaData = {
      name: shortName,
      description: "Avatar Design: https://multiavatar.com/",
      image: `${gatewayUrl}${uploadedFiles[i].IpfsHash}`,
    }

    const options = {
      pinataMetadata: {
        name: shortName,
        // keyvalues: {
        //   customKey: "customValue",
        //   customKey2: "customValue2",
        // },
      },
      pinataOptions: {
        cidVersion: 0,
      },
    }

    const uploadPromise = pinata.pinJSONToIPFS(metaData, options)
    promises.push(uploadPromise)
  }

  return Promise.all(promises)
}

function createLog(
  filenames,
  uploadedFiles,
  uploadedMetaData,
  outputFilePath = "./uploadedIpfs.json"
) {
  return new Promise((resolve, reject) => {
    const logs = {}
    for (const [i, filename] of filenames.entries()) {
      const shortName = filename.split(".")[0]
      logs[shortName] = {
        filename,
        image: uploadedFiles[i],
        metaData: uploadedMetaData[i],
      }
    }

    fs.writeFile(outputFilePath, JSON.stringify(logs), (err) => {
      if (err) reject()

      console.log(`The logs have been saved to ${outputFilePath}!`)
      resolve()
    })
  })
}

async function main(dirname = "output", outputFilePath) {
  try {
    const filenames = await readFiles(dirname, null, console.error)

    const uploadedFiles = await uploadFileToIpfs("output", filenames)

    const uploadedMetaData = await uploadMetaDataToIpfs(
      filenames,
      uploadedFiles
    )

    await createLog(filenames, uploadedFiles, uploadedMetaData, outputFilePath)

    console.log(`done uploading ${uploadedMetaData.length} files`)
  } catch (error) {
    console.error(error)
  }
}

const dirname = "output"
const outputFilePath = "output/uploadedIpfs.json"

main(dirname, outputFilePath)
