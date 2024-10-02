import Chronicals from '../../index.js'
import env from '../../env.js'

const chronicals = new Chronicals({
  apiKey: env.DEMO_API_KEY,
  logLevel: 'debug',
  endpoint: 'ws://localhost:3000/websocket',
  routes: {
    helloCurrentUser: async (io, ctx) => {
      console.log(ctx.params)

      let heading = `Hello, ${ctx.user.firstName} ${ctx.user.lastName}`

      if (ctx.params.message) {
        heading += ` (Message: ${ctx.params.message})`
      }

      await io.display.heading(heading)
    },
  },
})

chronicals.listen()

setTimeout(async () => {
  await chronicals.enqueue('helloCurrentUser', {
    assignee: 'alex@interval.com',
    params: {
      message: 'Hello, queue!',
    },
  })

  const queuedAction = await chronicals.enqueue('helloCurrentUser', {
    params: {
      message: 'Hello, anyone!',
    },
  })

  await chronicals.dequeue(queuedAction.id)
}, 1000)
