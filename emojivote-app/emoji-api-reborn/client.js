import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'

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
const EmojiService = emojiPackage.EmojiService

const client = new EmojiService("localhost:50051", grpc.credentials.createInsecure())

client.readEmojis({}, (error, emojis) => {
  if (error) {
    console.log(error)
  } else {
    console.log("recibido: ", emojis)
  }
})