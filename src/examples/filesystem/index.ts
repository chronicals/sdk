import path from 'path'
import Chronicals from '../../index.js'
import env from '../../env.js'

const chronicals = new Chronicals({
  apiKey: env.DEMO_API_KEY,
  logLevel: 'debug',
  endpoint: 'ws://localhost:3000/websocket',
  routesDirectory: path.resolve(__dirname, 'routes'),
})

chronicals.listen()
