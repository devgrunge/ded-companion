export interface User {
  id: string;
  email: string;
}

export type UserData = {
  id: string;
  email: string;
  password: string;
};

export interface VerifiedUser {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}
