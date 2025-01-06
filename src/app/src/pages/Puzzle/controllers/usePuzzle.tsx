import { useCallback, useEffect, useMemo, useState } from "react";
import { Puzzle } from "../types";
import SAMPLE_PUZZLE_DATA from './SAMPLE_PUZZLE_DATA.json';
import { Chess, PieceSymbol } from "chess.js";
import { PromotionPieceOption, ChessboardProps as ReactChessboardProps, Square } from "react-chessboard/dist/chessboard/types";
import { Move } from "../../../components/Chessboard/types";

const LICHESS_PUZZLE_API_ENDPOINT = `https://lichess.org/api/puzzle/next`;
const debug = false;

type PuzzleProps = Partial<ReactChessboardProps> & {
    game: Chess;
    fen: string;

    solved: boolean;

    // gets next puzzle
    next: () => void;

    // intiially undefined, guaranteed value after API call
    puzzle?: Puzzle;


}

export const usePuzzle = (): PuzzleProps => {
    const game = useMemo(() => new Chess(), []);

    // Chess isn't reactive, so will use the fen representation
    // of the game to trigger react updates. Every time board state changes,
    // should not only update the game object but also the fen state
    const [fen, setFen] = useState(() => game.fen());
    const [solved, setSolved] = useState(false);

    const [puzzle, setPuzzle] = useState<Puzzle>();
    const [moveList, setMoveList] = useState<string[]>();

    const makeMove = useCallback((move: Move) => {
        game.move(move);
        setFen(game.fen());
    }, [game]);

    const next = useCallback(() => {
        fetch(LICHESS_PUZZLE_API_ENDPOINT).then(res => res.json()).then(setPuzzle);
    }, []);

    function onPromotionPieceSelect(
        piece?: PromotionPieceOption,
        promoteFromSquare?: Square,
        promoteToSquare?: Square
    ) {
        if (!piece || !promoteFromSquare || !promoteToSquare || !moveList) return false;

        const move = promoteFromSquare + promoteToSquare + piece.substring(1).toLowerCase() as PieceSymbol;

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
        }, 300);
        return true;
    }

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
        }, 300);
        return true;
    }, [moveList, makeMove]);

    useEffect(() => {
        if (debug) return setPuzzle(SAMPLE_PUZZLE_DATA);
        next();
    }, [next]);

    useEffect(() => {
        if (!puzzle) return;

        game.loadPgn(puzzle?.game.pgn);
        setFen(game.fen());
        setSolved(false);
        setMoveList(puzzle.puzzle.solution);

    }, [puzzle, game]);

    return { puzzle, game, fen, onPieceDrop, onPromotionPieceSelect, solved, next };
};