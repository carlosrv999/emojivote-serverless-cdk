import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import { getVotes, voteForEmoji } from './queries.js'

const PROTO_FILE = './emoji.proto'

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

// load the proto file
const pkgDefs = protoLoader.loadSync(PROTO_FILE, options)

// load defs into gRPC
const emojiProto = grpc.loadPackageDefinition(pkgDefs)
const emojiPackage = emojiProto.emojiPackage

const server = new grpc.Server()

const readVotes = async (input, callback) => {
  try {
    const result = await getVotes()
    callback(null, {votes: result})
  } catch (error) {
    callback(error, null)
  }
}

const createVote = async (input, callback) => {
  try {
    const result = await voteForEmoji(input.request.emoji_id)
    callback(null, {
      result: "success",
      voted: {
        "emoji_id": input.request.emoji_id
      }
    })
  } catch (error) {
    callback(error, null)
  }
}

// Implement EmojiService
server.addService(emojiPackage.EmojiService.service, {
  "readVotes": readVotes,
  "createVote": createVote,
})

export { server, grpc }
