import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../../../controllers/storage.types";

export interface StatsStore {
    total: number;
    attempted: number;
    solved: number;
    skipped: number;

    incrementTotal: () => void;
    incrementAttempted: () => void;
    incrementSolved: () => void;
    incrementSkipped: () => void;
}

export const useStatsStore = create(persist<StatsStore>((set) => ({
    total: 0,
    attempted: 0,
    solved: 0,
    skipped: 0,

    incrementTotal: () => set((state) => ({ total: state.total + 1 })),
    incrementAttempted: () => set((state) => ({ attempted: state.attempted + 1 })),
    incrementSolved: () => set((state) => ({ solved: state.solved + 1 })),
    incrementSkipped: () => set((state) => ({ skipped: state.skipped + 1 })),
}), {
    name: STORAGE_KEYS.STATS
}));