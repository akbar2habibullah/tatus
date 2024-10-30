import { Elysia } from 'elysia';
import { authApp } from './auth'
import { kafkaCron } from './kafka'
import { apiRoute } from './api'

const app = new Elysia()
  .mount(authApp)
  .mount(apiRoute)
  .mount(kafkaCron)
  .listen(3000);

export default app;