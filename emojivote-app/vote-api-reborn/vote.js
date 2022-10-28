import express from 'express'
import { getVotes, voteForEmoji } from './queries.js'
const router = express.Router()

router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.get('/vote', async (req, res) => {
  try {
    const result = await getVotes()
    return res.status(200).send(result.Items)
  } catch (error) {
    return res.status(500).send({
      "error": "unknown error, check logs"
    })
  }
})

router.post('/vote', async (req, res) => {
  if (!req.body.emoji_id) return res.status(500).send({
    "error": "need to specify emoji_id in body"
  });
  try {
    const result = await voteForEmoji(req.body.emoji_id)
    console.log(result);
    return res.status(200).send(result)
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      "error": "unknown error, check logs"
    })
  }
})

export default router