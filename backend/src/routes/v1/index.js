import express from 'express'
const router = express.Router()
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message : 'ok'
  })
})

router.use('/boards', boardRoute)
export const APIs_V1 = router