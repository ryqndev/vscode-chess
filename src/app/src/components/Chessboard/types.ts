import type { Move as ChessJsMove } from "chess.js";

/** type comes from react-chessboard and is incompatible with chess.js */
export type Piece =
  | "wP"
  | "wB"
  | "wN"
  | "wR"
  | "wQ"
  | "wK"
  | "bP"
  | "bB"
  | "bN"
  | "bR"
  | "bQ"
  | "bK";

export type Move = string | Pick<ChessJsMove, "from" | "to" | "promotion">;
