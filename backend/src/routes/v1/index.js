import express from 'express'
const router = express.Router()
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute'
import { cardRoute } from './cardRoute'
import { columnRoute } from './columnRoute'

router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message : 'ok'
  })
})

router.use('/boards', boardRoute)
router.use('/columns', columnRoute)
router.use('/cards', cardRoute)
export const APIs_V1 = router