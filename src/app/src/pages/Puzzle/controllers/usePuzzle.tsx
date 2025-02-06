import { useCallback, useEffect, useMemo } from "react";
import { Chess, PieceSymbol } from "chess.js";
import { PromotionPieceOption, ChessboardProps as ReactChessboardProps, Square } from "react-chessboard/dist/chessboard/types";
import { Move } from "../../../components/Chessboard/types";
import { useShallow } from "zustand/shallow";
import { usePuzzleStore, game } from "./puzzle-store";

const SIMULATE_OPPONENT_THINK_TIME_MS = 500;

type PuzzleProps = Partial<ReactChessboardProps> & {
    game: Chess;
}

export const usePuzzle = (): PuzzleProps => {
    const { puzzle } = usePuzzleStore(useShallow(({ puzzle, setPuzzle }) => ({ puzzle, setPuzzle })));
    const { moveList, setMoveList } = usePuzzleStore(useShallow(({ moveList, setMoveList }) => ({ moveList, setMoveList })));
    const { setSolved, setFen } = usePuzzleStore(useShallow(({ setFen, setSolved }) => ({ setFen, setSolved })));

    const makeMove = useCallback((move: Move) => {
        game.move(move);
        setFen(game.fen());
    }, [setFen]);

    const onPromotionPieceSelect = useCallback((
        piece?: PromotionPieceOption,
        promoteFromSquare?: Square,
        promoteToSquare?: Square
    ) => {
        if (!piece || !promoteFromSquare || !promoteToSquare || !moveList) return false;

        const move = promoteFromSquare + promoteToSquare + piece.substring(1).toLowerCase() as PieceSymbol;

        const [correctMove, response, ...restOfSequence] = moveList;

        if (move !== correctMove) return false;

        makeMove(move);

        // correctly solved puzzle
        if (!response) {
            setSolved(true);
            return true;
        }
        setTimeout(() => {
            makeMove(response);
            setMoveList(restOfSequence);
        }, SIMULATE_OPPONENT_THINK_TIME_MS);
        return true;
    }, [makeMove, moveList, setMoveList, setSolved]);

    const onPieceDrop = useCallback((sourceSquare: Square, targetSquare: Square) => {
        if (!moveList) return false;

        const move = sourceSquare + targetSquare;
        const [correctMove, response, ...restOfSequence] = moveList;

        if (move !== correctMove) {
            return false;
        }

        makeMove(move);

        // correctly solved puzzle
        if (!response) {
            setSolved(true);
            return true;
        }
        setTimeout(() => {
            makeMove(response);
            setMoveList(restOfSequence);
        }, SIMULATE_OPPONENT_THINK_TIME_MS);
        return true;
    }, [makeMove, moveList, setMoveList, setSolved]);

    useEffect(() => {
        if (!puzzle) return;

        game.loadPgn(puzzle?.game.pgn);
        console.log('@ryqndev', puzzle);
        setFen(game.fen());
        setSolved(false);
        setMoveList(puzzle.puzzle.solution);
    }, [setMoveList, setFen, setSolved, puzzle]);

    const startingSide = useMemo(() =>
        (puzzle?.game.pgn.split(' ').length ?? 0) % 2 ? "black" : "white"
        , [puzzle]);

    return { game, onPieceDrop, boardOrientation: startingSide, onPromotionPieceSelect };
};