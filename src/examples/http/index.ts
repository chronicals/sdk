import http from 'http'
import Chronicals, { Page, Layout } from '../../experimental.js'
import { asyncTable } from '../utils/ioMethodWrappers.js'
import env from '../../env.js'

const sleep = async (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

const chronicals = new Chronicals({
  apiKey: env.DEMO_PROD_API_KEY,
  logLevel: 'debug',
  endpoint: 'ws://localhost:3000/websocket',
  routes: {
    hello_http: async io => {
      const message = await io.input.text('Enter a message')
      return `"${message}", from HTTP!`
    },
    hello_http_pages: new Page({
      name: 'Hello, HTTP pages!',
      handler: async () => {
        return new Layout({
          title: 'Inside a page via HTTP',
          children: [asyncTable(500)],
        })
      },
      routes: {
        sub_action: async () => {
          return 'Hello, from a sub action!'
        },
      },
    }),
  },
})

const port = process.env.PORT ? Number(process.env.PORT) : 5000

const server = http.createServer(async (req, res) => {
  // Simulate a slow cold-start time for a serverless function
  await sleep(2000)

  return chronicals.httpRequestHandler(req, res)
})

server.listen(port)

console.log(`Listening on http://localhost:${port}`)
