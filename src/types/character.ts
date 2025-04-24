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
  imageUrl: string;
  gameImageUrl: string; // ← añade esto
  cost: number;
  powers: string[];
  pieces: Piece[];
  unlocked: boolean;
}

