import express from 'express'
import cors from 'cors'
import router from './emoji.js'
import { server, grpc } from './grpc-server.js'
import { verifyDdb } from './verify-db.js'

const app = express()
const port = 3000
const grpcPort = 50050

app.use(cors())
app.use(express.json())

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

app.use(router)

app.get('/', (req, res) => {
  res.send('App is running')
})

try {
  if (await verifyDdb()) {
    app.listen(port, () => {
      console.log(`REST API Server listening on port ${port}`)
    })
    server.bindAsync(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
      console.log(`gRPC Server listening on ${port}`)
      server.start()
    })
  } else {

  }
} catch (error) {
  throw error;
}
