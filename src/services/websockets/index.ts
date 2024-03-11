import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Server, ServerOptions } from "socket.io";
import { Character } from "../../models/types/model_types.ts";

const fastifySocketIO: FastifyPluginAsync<Partial<ServerOptions>> = fp(
  async function (fastify, opts) {
    fastify.decorate("io", new Server(fastify.server, opts));
    fastify.addHook("onClose", (fastify: FastifyInstance, done) => {
      (fastify as any).io.close();
      done();
    });
  },
  { fastify: ">=4.x.x", name: "fastify-socket.io" }
);

export interface FetchCharacterDataRequest {
  email: string;
}

export interface CharacterDataResponse {
  error?: string;
  data?: Character[];
}

export default fastifySocketIO;
