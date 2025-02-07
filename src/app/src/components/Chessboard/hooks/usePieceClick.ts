import { CSSProperties, useState } from "react";
import { game } from "../../../pages/Puzzle/controllers/puzzle.store";
import { Square } from "chess.js";
import { Piece } from "../types";

/**
 * handles drawing the dots and allowing click to move
 */
export const usePieceClick = (onPieceDrop?: ((sourceSquare: Square, targetSquare: Square, piece: Piece) => boolean)) => {
    const [moveFrom, setMoveFrom] = useState<Square>();
    const [movePiece, setMovePiece] = useState<Piece>();

    const [clickToMoveOptions, setClickToMoveOptions] = useState({});

    const onSquareClick = (square: Square) => {
        if (!moveFrom || !movePiece) return getMoveOptions(square);

        onPieceDrop?.(moveFrom, square, movePiece);
        setMoveFrom(undefined);
        setMovePiece(undefined);
        setClickToMoveOptions({});
    };

    const getMoveOptions = (square: Square) => {
        const piece = game.get(square);

        if (!piece) return;

        const moves = game.moves({
            square,
            verbose: true
        });

        if (moves.length === 0) {
            setMoveFrom(undefined);
            setMovePiece(undefined);
            setClickToMoveOptions({});
            return;
        }
        setMoveFrom(square);
        setMovePiece((piece.color + piece.type.toUpperCase()) as Piece);

        const newSquares: { [key in Square]?: CSSProperties; } = {};

        moves.forEach(move => {
            newSquares[move.to] = {
                background: game.get(move.to) && game.get(move.to).color !== game.get(square).color ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)" : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
                borderRadius: "50%"
            };
        });
        newSquares[square] = {
            background: "rgba(255, 255, 0, 0.4)"
        };
        setClickToMoveOptions(newSquares);
    };

    return { onSquareClick, customSquareStyles: clickToMoveOptions };
};