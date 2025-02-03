import { useCallback, useEffect, useMemo } from "react";
// import SAMPLE_PUZZLE_DATA from './SAMPLE_PUZZLE_DATA.json';
import { Chess, PieceSymbol } from "chess.js";
import { PromotionPieceOption, ChessboardProps as ReactChessboardProps, Square } from "react-chessboard/dist/chessboard/types";
import { Move } from "../../../components/Chessboard/types";
import { useShallow } from "zustand/shallow";
import { usePuzzleStore, game } from "./puzzle-store";

const LICHESS_PUZZLE_API_ENDPOINT = `https://lichess.org/api/puzzle/next`;

const SIMULATE_OPPONENT_THINK_TIME_MS = 500;

type PuzzleProps = Partial<ReactChessboardProps> & {
    game: Chess;

    // gets next puzzle
    next: () => void;

    // side that starts in puzzle
    startingSide: boolean;

}

export const usePuzzle = (): PuzzleProps => {
    const { puzzle, setPuzzle } = usePuzzleStore(useShallow(({ puzzle, setPuzzle }) => ({ puzzle, setPuzzle })));
    const { moveList, setMoveList } = usePuzzleStore(useShallow(({ moveList, setMoveList }) => ({ moveList, setMoveList })));
    const { setSolved, setFen } = usePuzzleStore(useShallow(({ setFen, setSolved }) => ({ setFen, setSolved })));

    const makeMove = useCallback((move: Move) => {
        game.move(move);
        setFen(game.fen());
    }, [setFen]);

    const next = useCallback(() => {
        // setPuzzle(SAMPLE_PUZZLE_DATA);
        fetch(LICHESS_PUZZLE_API_ENDPOINT).then(res => res.json()).then(setPuzzle);
    }, [setPuzzle]);

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
        setFen(game.fen());
        setSolved(false);
        setMoveList(puzzle.puzzle.solution);
    }, [setMoveList, setFen, setSolved, puzzle]);

    const startingSide = useMemo(() =>
        Boolean((puzzle?.game.pgn.split(' ').length ?? 0) % 2)
        , [puzzle]);

    return { game, onPieceDrop, onPromotionPieceSelect, next, startingSide };
};