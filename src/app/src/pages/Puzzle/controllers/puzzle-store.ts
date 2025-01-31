import { Chess } from 'chess.js';
import { create } from 'zustand';
import { Puzzle } from '../types';

// Chess isn't reactive, so will use the fen representation
// of the game to trigger react updates. Every time board state changes,
// should not only update the game object but also the fen state
export const game = new Chess();

export interface PuzzleStore {
    // current position of game
    fen: string;

    // list of moves to correctly solve puzzle
    moveList?: string[];

    // puzzle data that comes from Lichess API
    puzzle?: Puzzle;

    // whether or not the current has been solved
    solved: boolean;

    setFen: (fen: string) => void;
    setMoveList: (moveList: string[]) => void;
    setPuzzle: (puzzle: Puzzle) => void;
    setSolved: (solved: boolean) => void;
}

export const usePuzzleStore = create<PuzzleStore>((set) => ({
    fen: game.fen(),
    moveList: undefined,
    puzzle: undefined,
    solved: false,

    setFen: (fen) => set({ fen }),
    setMoveList: (moveList) => set({ moveList }),
    setPuzzle: (puzzle) => set({ puzzle }),
    setSolved: (solved) => set({ solved }),
}));

