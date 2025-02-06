import { useShallow } from "zustand/shallow";
import { usePuzzleStore } from "./puzzle-store";
import { useCallback } from "react";

// import SAMPLE_PUZZLE_DATA from './SAMPLE_PUZZLE_DATA.json';


const LICHESS_PUZZLE_API_ENDPOINT = `https://lichess.org/api/puzzle/next`;


export const useGetNextPuzzle = () => {
    const { setPuzzle } = usePuzzleStore(useShallow(({ puzzle, setPuzzle }) => ({ puzzle, setPuzzle })));

    const next = useCallback(() => {
        // setPuzzle(SAMPLE_PUZZLE_DATA);
        fetch(LICHESS_PUZZLE_API_ENDPOINT).then(res => res.json()).then(setPuzzle);
    }, [setPuzzle]);

    return next;
};