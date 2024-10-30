import { Elysia } from "elysia";
import { queueCron } from './queue'
import './queue'

const app = new Elysia()
  .use(queueCron)
  .listen(3000);

console.log(
  `Elysia Queue is running at ${app.server?.hostname}:${app.server?.port}`
);
