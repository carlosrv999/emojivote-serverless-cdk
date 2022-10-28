import express from 'express'
import { scanEmojiTable } from './queries.js'
const router = express.Router()

router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.get('/emoji', (req, res) => {
  scanEmojiTable((results) => {
    res.send(results)
  }, (error) => {
    res.status(500).send(error)
  })
})

export default router
