import { ObjectId, WithId } from "mongodb";

export interface Character {
  id: string;
  name: string;
  level: number;
  class: string;
  attributes: {
    str: number | unknown;
    dex: number | unknown;
    con: number | unknown;
    int: number | unknown;
    wis: number | unknown;
    car: number | unknown;
  };
  hitpoints: number;
  armor_class: number;
  initiative: number | null;
}

export interface Player {
  id?: string;
  character?: Character;
  isDm?: boolean;
  name?: string;
}
export interface CharacterData {
  id: string;
  name: string;
  level?: number;
  class?: string;
  attributes: {
    str?: number | unknown;
    dex?: number | unknown;
    con?: number | unknown;
    int?: number | unknown;
    wis?: number | unknown;
    car?: number | unknown;
  };
  hitpoints?: number;
  armor_class?: number;
  initiative?: number;
  owner?: string;
  isDm?: boolean;
}

export interface UpdatePlayersRequestBody {
  playerName: string;
  updatedData: Character;
  roomId: string | unknown;
}

export interface RoomsModel {
  _id?: ObjectId;
  room_id?: string;
  room_name?: string;
  inviteCode?: string;
  players: Player[];
  owner?: string;
}

export interface PlayersModel {
  _id?: ObjectId;
  id?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
  characters?: Character[] | undefined;
  isDm?: boolean | undefined;
  theme?: string | undefined;
}
