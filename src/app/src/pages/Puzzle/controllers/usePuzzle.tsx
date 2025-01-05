import { useCallback, useEffect, useMemo, useState } from "react";
import { Puzzle } from "../types";
import SAMPLE_PUZZLE_DATA from './SAMPLE_PUZZLE_DATA.json';
import { Chess } from "chess.js";
import { Piece, ChessboardProps as ReactChessboardProps, Square } from "react-chessboard/dist/chessboard/types";
import { Move } from "../../../components/Chessboard/types";

const LICHESS_PUZZLE_API_ENDPOINT = `https://lichess.org/api/puzzle/daily`;
const debug = true;

type PuzzleProps = Partial<ReactChessboardProps> & {
    game: Chess;
    fen: string;

    // intiially undefined, guaranteed value after API call
    puzzle?: Puzzle;
}

export const usePuzzle = (): PuzzleProps => {
    const game = useMemo(() => new Chess(), []);

    // Chess isn't reactive, so will use the fen representation
    // of the game as the react update. Every time board state changes,
    // should not only update the game object but also the fen state
    const [fen, setFen] = useState(() => game.fen());

    const [puzzle, setPuzzle] = useState<Puzzle>();
    const [moveList, setMoveList] = useState<string[]>();

    const makeMove = useCallback((move: Move) => {
        game.move(move);
        setFen(game.fen());
    }, [game]);

    const onPieceDrop = useCallback((sourceSquare: Square, targetSquare: Square, piece: Piece) => {
        if (!moveList) return false;

        const move = sourceSquare + targetSquare;
        const [correctMove, response, ...restOfSequence] = moveList;

        if (move !== correctMove) {
            // errr! u messed up
            alert('U made a big mistake buddy');
            return true;
        }

        makeMove(move);

        if (!response) {
            // that was the final correct move
            alert('passed!');
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
        fetch(LICHESS_PUZZLE_API_ENDPOINT).then(res => res.json()).then(setPuzzle);
    }, []);

    useEffect(() => {
        if (!puzzle) return;

        game.loadPgn(puzzle?.game.pgn);
        setMoveList(puzzle.puzzle.solution);
        setFen(game.fen());
    }, [puzzle, game]);

    return { puzzle, game, fen, onPieceDrop };
};