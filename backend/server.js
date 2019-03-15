const keccak = require('keccak')
const express = require("express")
const bodyParser = require("body-parser")
const Memcached = require("memcached")

const APP_HOST = '0.0.0.0'  // backendサーバが動作するホスト名
const APP_PORT = 5650       // backendサーバが動作するポート番号
const DB_HOST = 'localhost' // inner memcachedのホスト名
const DB_PORT = 5652        // inner memcachedのポート番号

const app = express() // expressを使う準備
app.use(bodyParser())

const memcached = new Memcached(`${DB_HOST}:${DB_PORT}`) // memcached apiを使う準備

// カウンターを増やす
async function incrCount () {
  return new Promise((resolve, reject) => {
    memcached.incr('count', 1, (err, result) => {
      if (err) return reject(err)
      if (typeof result === 'number') return resolve(result)
      memcached.set('count', 1, 0, (err) => {
        if (err) return reject(err)
        resolve(1)
      })
    })
  })
}

app.post('/api/generate', async (req, res) => {
  const sender = req.header('uniqys-sender')
  const timestamp = req.header('uniqys-timestamp')
  const blockhash = req.header('uniqys-blockhash')

  const count = await incrCount()
  const newSushi = {
    id: count,
    status: 'normal',
    price: 0,
    owner: sender,
    dna: keccak('keccak256').update(count.toString()).digest('hex'),
    timestamp: timestamp,
    blockhash: blockhash
  }

  memcached.set(`sushi:${count}`, newSushi, 0, (err) => {
    if (err) {
      res.status(400).send(err)
    }
    else {
      res.sendStatus(200)
    }
  })
})

app.listen(APP_PORT, APP_HOST) // listenを開始する