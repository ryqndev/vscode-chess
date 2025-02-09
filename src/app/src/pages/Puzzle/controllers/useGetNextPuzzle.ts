import { usePuzzleStore } from "./puzzle.store";
import { useCallback } from "react";
import SAMPLE_PUZZLE_DATA from './SAMPLE_PUZZLE_DATA.json';

const debug = false;

const LICHESS_PUZZLE_API_ENDPOINT = `https://lichess.org/api/puzzle/next?angle=promotion`;

export const useGetNextPuzzle = () => {
    const setPuzzle = usePuzzleStore(state => state.setPuzzle);

    return useCallback(() => {
        if (debug) return setPuzzle(SAMPLE_PUZZLE_DATA);
        fetch(LICHESS_PUZZLE_API_ENDPOINT).then(res => res.json()).then(setPuzzle);
    }, [setPuzzle]);
};