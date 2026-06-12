import { create } from "zustand";

export const useSignalStore = create((set) => ({
  signal: null,

  setSignal: (signal) => set({ signal })
}));
