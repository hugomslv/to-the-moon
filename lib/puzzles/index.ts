import { Puzzle } from "./types";

export const PUZZLES: Puzzle[] = [
  {
    id: "morse-transmission",
    order: 1,
    title: "Transmission brouillée",
    narrative:
      "La station orbitale reçoit un message codé en morse depuis la surface de Mars. Déchiffre-le pour obtenir le code de déverrouillage du module de propulsion.",
    type: "morse",
    question:
      "Déchiffre ce message morse :\n\n-... --- -. .--- --- ..- .-..",
    answer: "bonjour",
    hints: [
      "Le morse utilise des points (.) et des tirets (-). Chaque lettre est séparée par un espace, chaque mot par trois espaces.",
      "La première lettre correspond à -... soit la lettre B.",
    ],
    penaltySeconds: 60,
  },
  {
    id: "binary-coords",
    order: 2,
    title: "Coordonnées binaires",
    narrative:
      "Les coordonnées de la zone d'atterrissage sont encodées en binaire dans les logs de navigation. Convertis le nombre pour continuer la mission.",
    type: "binary",
    question: "Convertis ce nombre binaire en décimal :\n\n01001010",
    answer: "74",
    hints: [
      "Chaque bit vaut 2^n depuis la droite (2^0=1, 2^1=2, 2^2=4…). Additionne les puissances de 2 correspondant aux bits à 1.",
      "Les bits à 1 sont aux positions 1, 3 et 6 (en partant de 0) : 2 + 8 + 64 = ?",
    ],
    penaltySeconds: 90,
  },
  {
    id: "caesar-final",
    order: 3,
    title: "Message du commandant",
    narrative:
      "Le commandant a verrouillé l'accès final avec un chiffre de César. Déchiffre son message pour achever la mission et rentrer sur Terre.",
    type: "caesar",
    question: "Déchiffre ce message (décalage de 3) :\n\nOLXQH",
    answer: "lune",
    hints: [
      "Le chiffre de César décale chaque lettre dans l'alphabet. Décalage +3 : A→D. Pour déchiffrer, recule de 3 : D→A.",
      "O-3=L, L-3=I (→ non…). Reprends lettre par lettre : O→L, L→I (→ non). O=15e lettre, -3=12e=L. Essaie chaque lettre.",
    ],
    penaltySeconds: 120,
  },
];

export function getPuzzleById(id: string): Puzzle | undefined {
  return PUZZLES.find((p) => p.id === id);
}

export function getPuzzleByOrder(order: number): Puzzle | undefined {
  return PUZZLES.find((p) => p.order === order);
}
