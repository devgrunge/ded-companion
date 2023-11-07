export interface Character {
  id: string;
  name: string;
  level: number;
  class: string;
  attributes: {
    hitpoints: number;
    armor_class: number;
    initiative: number | null;
  };
}
 
export interface Player {
  id: string;
  character?: Character;
  isDm: boolean;
  name: string;
}