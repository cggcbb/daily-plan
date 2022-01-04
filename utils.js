const dayjs = require('dayjs')
const fs = require('fs')
const readline = require('readline')

function handleResponse(promise, errorExtra) {
  return promise
    .then(data => [null, data])
    .catch(err => {
      const errorData = err.response.data
      if (errorExtra) {
        return [Object.assign({}, errorData, errorExtra), null]
      }
      return [errorData, null]
    })
}

function createToday() {
  return dayjs().format('YYYY-MM-DD')
}

function exist(arr, compare) {
  return arr.find(compare)
}

function createTemplateContent(pathToFile) {
  const data = fs.readFileSync(pathToFile, { encoding: 'utf8' })
  return data
}

async function isContainTitle(pathToFile, date) {
  const title = await readFirstLine(pathToFile)
  return title && title.includes(date)
}

async function readFirstLine(pathToFile) {
  const readable = fs.createReadStream(pathToFile)
  const reader = readline.createInterface({ input: readable })
  const line = await new Promise(resolve => {
    reader.on('line', line => {
      reader.close()
      resolve(line)
    })
  })
  readable.close()
  return line
}

module.exports = {
  handleResponse,
  createToday,
  exist,
  isContainTitle,
  createTemplateContent
}
