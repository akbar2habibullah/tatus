import cron, { Patterns } from '@elysiajs/cron'
import { Elysia } from "elysia";
import { redis } from './redis'

const app = new Elysia()
  .use(
    cron({
      name: 'clear-processed-updates',
      pattern: Patterns.EVERY_HOUR,
      async run() {
        await redis.del("processed-updates")
        await redis.sadd("processed-updates", "")
      }
    })
  )
  .listen(3000);

console.log(
  `Elysia CRON is running at ${app.server?.hostname}:${app.server?.port}`
);
