import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "./storage.types";

interface SettingsStore {
    invisibleMode?: number;

    // either null or a number between 0-1
    setInvisibleMode: (invisibleMode?: number) => void;
}

export const useSettingsStore = create(persist<SettingsStore>((set) => ({
    invisibleMode: undefined,

    setInvisibleMode: (invisibleMode) => set({ invisibleMode })
}), { name: STORAGE_KEYS.SETTINGS }));