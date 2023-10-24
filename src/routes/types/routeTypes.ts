import { FastifyReply } from "fastify/types/reply";
import { FastifyRequest } from "fastify/types/request";
import { WithId } from "mongodb";

export interface IQuerystring {
  username: string;
  password: string;
}

export interface IHeaders {
  "h-Custom": string;
}

export interface IRequest {
  email?: string;
}

export interface CharacterParams {
  user: any;
  id: string;
}

export interface IReply {
  200: { success: boolean };
  201: { created: string | WithId<Document> };
  204: { updated: string };
  302: { url: string };
  "4xx": { error: string };
  500: { error: string };
}

export interface DmData {
  id: string;
  dm_name: string;
}

export interface RoomData {
  room_id: string;
  room_name: string;
  inviteCode: string;
  players: [];
}

export interface CharacterData {
  id: string;
  name: string;
  level: number;
  class: string;
  attributes: {
    for: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    car: number;
  };
  hitpoints: number;
  armor_class: number;
  initiative: number;
  owner?: string;
}
export interface CharacterRequest extends FastifyRequest {
  user: { email: string };
}

export interface RouteInterface {
  Request: FastifyRequest | IRequest;
  Reply: FastifyReply | IReply;
}
