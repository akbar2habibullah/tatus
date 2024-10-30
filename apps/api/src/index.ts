import { Elysia } from 'elysia';
import { authApp } from './auth'
import { apiRoute } from './api'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
  .use(cors({
    origin: ['localhost', /.*\.lawfuldiffusion\.my.id$/],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['DELETE', 'PUT', 'POST']
  }))
  .use(swagger({
    path: '/docs'
  }))
  .mount(authApp)
  .mount(apiRoute)
  .listen(3000);

export default app;