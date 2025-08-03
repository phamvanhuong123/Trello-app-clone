/* eslint-disable no-console*/

import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSED_DB } from '~/config/mongodb'


const START_SERVER = () => {
  const app = express()
  const port = 8071
  app.get('/', async (req, res) => {
    res.send('ádsad')
  })
  app.listen(port, () => {
    console.log(`Listen port :http://localhost:${port}`)
  })
  // Thực hiện các tác vụ cleanup trước khi dừng server
  exitHook(() => {
    console.log('closed disconnected mongoDB alast')
    CLOSED_DB()
  })
}

(async() => {
  try {
    await CONNECT_DB()
    console.log('Connected mongoDB database')
    START_SERVER()
  }
  catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// CONNECT_DB()
//   .then(() => console.log('Connected mongoDB database'))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error)
//     process.exit(0)
//   })
