import { Chessboard } from "react-chessboard";
import { Chess, PieceSymbol, Square } from "chess.js";
import cn from "./Game.module.scss";
import { useCallback, useState } from "react";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { Move } from "./types.js";


const game = new Chess();

export const Game = () => {
  const [fen, setFen] = useState(() => game.fen());

  const makeMove = useCallback((move: Move, callback?: () => void) => {
    try {
      game.move(move);
    } catch (e) {
      return false;
    }
    setFen(game.fen());

    callback?.();
  }, []);

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    makeMove({ from: sourceSquare, to: targetSquare }, makeRandomMove);

    return true;
  }
  function onPromotionPieceSelect(
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ) {
    if (!piece || !promoteFromSquare || !promoteToSquare) return false;

    makeMove(
      {
        from: promoteFromSquare,
        to: promoteToSquare,
        promotion: piece.substring(1).toLowerCase() as PieceSymbol,
      },
      makeRandomMove
    );

    return true;
  }

  return (
    <div className={cn.container}>
      <div className={cn.board}>
        turn: {game.turn()}
        <br />
        comment: {game.getComment()}
        <br />
        <Chessboard
          id="main"
          position={fen}
          onPieceDrop={onDrop}
          onPromotionPieceSelect={onPromotionPieceSelect}
        />
      </div>
    </div>
  );
};
