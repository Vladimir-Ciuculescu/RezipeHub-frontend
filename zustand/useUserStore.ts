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
  isLoggedIn: boolean;
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
  isLoggedIn: false,
};

interface Action {
  setUser: (user: any) => void;
  setLoggedStatus: (status: boolean) => void;
}

const useUserStoreBase = create<UserStoreState & Action>()((set, get) => ({
  ...initialState,

  setUser: (user: any) => {
    set({ user });
  },

  setLoggedStatus: (status: boolean) => {
    set({ isLoggedIn: status });
  },
}));

const useUserStore = createSelectors(useUserStoreBase);

export default useUserStore;
