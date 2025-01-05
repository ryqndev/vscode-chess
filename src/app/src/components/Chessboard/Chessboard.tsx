import { memo, useCallback } from "react";
import { Chessboard as ReactChessBoard } from "react-chessboard";
import { Chess, PieceSymbol, Square } from "chess.js";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { Move } from "./types";

// const game = new Chess();

interface ChessboardProps {
    fen: string;
    // setFen: (fen: string) => void;
    game: Chess;
}

export const Chessboard = memo(function Chessboard({
    game,
    fen
}: ChessboardProps) {

    console.log('@ryqndev', fen);
    const makeMove = useCallback((move: Move, callback?: () => void) => {
        try {
            game.move(move);
        } catch (e) {
            return false;
        }
        // setFen(game.fen());
        callback?.();
    }, [game]);

    function onDrop(sourceSquare: Square, targetSquare: Square) {
        makeMove({ from: sourceSquare, to: targetSquare });
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
            });

        return true;
    }

    return (
        <ReactChessBoard
            id="main"
            position={fen}
            onPieceDrop={onDrop}
            onPromotionPieceSelect={onPromotionPieceSelect}
        />
    );
});