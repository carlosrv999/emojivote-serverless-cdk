import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import { scanEmojiTable } from './queries.js'

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

const readEmojis = (input, callback) => {
  scanEmojiTable((results) => {
    console.log("queried by gRPC")
    callback(null, { "emojis": results })
  }, (error) => {
    callback(error, null)
  })
}

// Implement EmojiService
server.addService(emojiPackage.EmojiService.service, {
  "readEmojis": readEmojis,
})

export { server, grpc }
