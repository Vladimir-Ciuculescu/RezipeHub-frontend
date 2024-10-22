import { create } from "zustand";
import { createSelectors } from "./createSelectors";

interface UserStoreState {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    photoUrl: string | null;
    bio: string | null;
  };
}

const initialState: UserStoreState = {
  user: {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    photoUrl: null,
    bio: null,
  },
};

interface Action {
  setUser: (user: any) => void;
}

const useUserStoreBase = create<UserStoreState & Action>()((set, get) => ({
  ...initialState,

  setUser: (user: any) => {
    set({ user });
  },
}));

const useUserStore = createSelectors(useUserStoreBase);

export default useUserStore;
