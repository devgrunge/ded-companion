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

export interface PlayerParams {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  characters?: [];
  isDm?: boolean;
}

export interface IRequest {
  email?: string;
}

export interface RouteInterface {
  Request: FastifyRequest | IRequest | unknown;
  Reply: FastifyReply | IReply;
}

export interface DungeonMasterRequest extends RouteInterface {
  Querystring: {
    search?: string;
  };
  Params: {
    id?: string | unknown;
  };
}

export interface RequestParams extends RouteInterface {
  params: {
    id: string | unknown;
  };
}

export interface RoomRequest extends FastifyRequest {
  room_id: string;
  character_id?: string;
  params: {
    [x: string]: any;
    id: string;
    inviteCode: string;
  };
}

export interface CharacterParams {
  user: any;
  id: string;
}

export interface IReply {
  200: { success: boolean | void | string };
  201: { created: string | WithId<Document> };
  204: { updated: string };
  302: { url: string };
  "4xx": { error: string };
  500: { error: string };
}

export interface DmData {
  id?: string;
  dm_name?: string | undefined;
}

export interface RoomData {
  room_id: string;
  room_name: string;
  inviteCode: string;
  players: [];
  character_id?: string;
  entity_id?: string | undefined;
}

export interface CharacterData {
  id: string;
  name: string;
  level?: number;
  class?: string;
  attributes: {
    str?: number;
    dex?: number;
    con?: number;
    int?: number;
    wis?: number;
    car?: number;
  };
  hitpoints?: number;
  armor_class?: number;
  initiative?: number;
  owner?: string;
  isDm?: boolean;
}
