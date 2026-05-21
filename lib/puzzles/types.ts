export type PuzzleType = "morse" | "binary" | "caesar" | "image" | "logic";

export interface Puzzle {
  id: string;
  order: number;
  title: string;
  narrative: string;
  type: PuzzleType;
  question: string;
  imageUrl?: string;
  answer: string;
  hints: [string, string];
  penaltySeconds: number;
}
