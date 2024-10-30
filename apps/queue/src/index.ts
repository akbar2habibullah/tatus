import { Elysia } from "elysia";
import { kafkaCron } from './queue'

const app = new Elysia()
  .use(kafkaCron)
  .listen(3000);

console.log(
  `Elysia Queue is running at ${app.server?.hostname}:${app.server?.port}`
);
