import { fastify } from "fastify";

const server = fastify();

server.get('/', () => {
  return 'Hello world'
})

server.listen({
  port: 3333
})