import { Elysia } from 'elysia';
import { authApp } from './auth'
import { apiRoute } from './api'

const app = new Elysia()
  .mount(authApp)
  .mount(apiRoute)
  .listen(3000);

export default app;