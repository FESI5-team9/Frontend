import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  id: number | null;
  email: string | null;
  name: string | null;
  nickname: string | null;
  image: string | null;
  favoriteGatheringCount: number;
  setUser: (user: Partial<UserStore>) => void;
  setFavoriteGatheringCount: (count: number) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    set => ({
      id: null,
      email: null,
      name: null,
      nickname: null,
      image: null,
      favoriteGatheringCount: 0,
      setUser: user => set(state => ({ ...state, ...user })),
      setFavoriteGatheringCount: count => set({ favoriteGatheringCount: count }),
    }),
    {
      name: "userData",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUserStore;
