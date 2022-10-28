import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import { params } from './params.js';

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
const VoteService = emojiPackage.EmojiService

const voteClient = new VoteService(params.postVoteUrl, grpc.credentials.createInsecure())
const emojiClient = new EmojiService(params.getEmojiUrl, grpc.credentials.createInsecure())

setInterval(() => {
  emojiClient.readEmojis({}, (error, emojis) => {
    if (error) {
      console.log(error)
    } else {
      console.log("recibido: ", emojis)
      console.log("Si se puede procesar");
      const items = emojis.emojis;
      const item = items[Math.floor(Math.random() * items.length)];
      console.log("votando por: ", item)
      voteClient.createVote(
        {
          emoji_id: item.emoji_id
        },
        (error, success) => {
          if (error) {
            console.log(error)
          } else {
            console.log("recibido: ", success)
          }
        })
    }
  })
}, 5000)


/*setInterval(() => {
  axios
    .get(`${constants.getEmojiUrl}`)
    .then(res => {
      if (res.data?.length > 0) {
        console.log("Si se puede procesar");
        const items = res.data;
        const item = items[Math.floor(Math.random()*items.length)];
        console.log("votando por: ", item)
        axios.post(`${constants.postVoteUrl}`, { "emoji_id" : item.id })
          .then(res => {
            console.log("votado: ", res.data)
          })
          .catch(error => {
            console.log("ha ocurrido un error!", error);
          })
      }
    })
    .catch(error => {
      console.log(error);
    })
  
}, 5000)*/