import type { Piece } from "./piece";

export interface Power {
  name: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  pieces: Piece[];
  powers: Power[];
  unlocked: boolean;
  imageUrl: string;
  playerId: string;
  cost: number;
}
