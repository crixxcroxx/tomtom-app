import create from "zustand";

const useStore = create(set => ({
  origin: {},
  setOrigin: (obj) => set({ origin: obj }),

  suggestions: [],
  setSuggestions: (arr) => set({ suggestions: arr }),

  destinations: [],
  setDestinations: (arr) => set({ destinations: arr }),

  matrixData: [],
  setMatrixData: (arr) => set({ matrixData: arr })

}))

export default useStore