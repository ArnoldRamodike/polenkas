// import { createClient } from 'redis'

// const client = createClient({
//   password: process.env.REDIS_PW,
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT
//   }
// })

// client.on('error', err => console.log(err))

// if (!client.isOpen) {
//   client.connect()
// }

// client.set('name', 'mario')

// export { client }

import { Redis } from '@upstash/redis'

export const client = new Redis({
    url: process.env.REDIS_PW,
    token: process.env.REDIS_HOST

})

// await redis.set('foo', 'bar');
// const data = await redis.get('foo');
