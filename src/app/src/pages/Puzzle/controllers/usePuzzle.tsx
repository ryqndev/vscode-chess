import { useEffect, useState } from "react";
import { Puzzle } from "../types";
import SAMPLE_PUZZLE_DATA from './SAMPLE_PUZZLE_DATA.json';
import { Chess } from "chess.js";

const LICHESS_PUZZLE_API_ENDPOINT = `https://lichess.org/api/puzzle/daily`;
const debug = true;

const game = new Chess();

export const usePuzzle = () => {
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const [fen, setFen] = useState<string>();


    useEffect(() => {
        if (debug) {
            setPuzzle(SAMPLE_PUZZLE_DATA);

        } else {
            fetch(LICHESS_PUZZLE_API_ENDPOINT).then(res => res.json()).then(setPuzzle);

        }
    }, []);

    useEffect(() => {
        if (!puzzle) return;
        game.loadPgn(puzzle?.game.pgn);
        console.log('@ryqndev', game.fen());
        setFen(game.fen());
    }, [puzzle]);

    return { puzzle, game, fen };
};