import UserService from "@/api/services/user.service";
import { ACCESS_TOKEN, REFRESH_TOKEN, storage } from "@/storage";
import { CurrentUser } from "@/types/user.types";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import Purchases from "react-native-purchases";
import * as Device from "expo-device";
import axios from "axios";
import { baseURL } from "@/api";
import { useFavorites } from "../hooks/favorites.hooks";
import FavoritesService from "../api/services/favorites.service";
import RecipeService from "../api/services/recipe.service";

type UserContextType = {
  user: any | null;
  setUser: React.Dispatch<any>;
  loading: boolean;
  error: string | null;
  setError: React.Dispatch<any>;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  // logout: () => Promise<void>;
  mounted: boolean;
  serverHealth: boolean;
  favoritesCount: number;
  setFavoritesCount: (favoritesCount: number) => void;
  recipesCount: number;
  setRecipesCount: (recipesCount: number) => void;
};

//TODO: Add User type here
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  //TODO : Add User type here
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [recipesCount, setRecipesCount] = useState(0);
  const [serverHealth, setServerHealth] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const serverStatus = await checkServerStatus();
      setServerHealth(serverStatus);

      if (!serverStatus) {
        setMounted(true);
        return;
      }

      try {
        const accessToken = storage.getString(ACCESS_TOKEN);

        if (accessToken) {
          await getProfile();
        }

        setMounted(true);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Authentication check failed");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await axios.get(`${baseURL}/health`);
      return (
        response.status === 200 &&
        response.data.status === "ok" &&
        response.data.info.database.status === "up"
      );
    } catch (error) {
      console.log("Server check failed:", error);
      return false;
    }
  };

  const login = async (accessToken: string, refreshToken: string) => {
    try {
      setLoading(true);
      storage.set(ACCESS_TOKEN, accessToken);

      await getProfile();

      storage.set(REFRESH_TOKEN, refreshToken);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    storage.delete(ACCESS_TOKEN);
    router.replace("/login");
    await signOut();
    await Purchases.logOut();
  };

  const getProfile = async () => {
    setLoading(true);

    try {
      const accessToken = storage.getString(ACCESS_TOKEN);

      if (accessToken) {
        const { id } = jwtDecode(accessToken) as CurrentUser;

        //TODO: Here check if simulator: otherwise won't find anyting
        let pushToken = "";

        if (Device.isDevice) {
          pushToken = await registerForPushNotificationsAsync();
        }

        const newAccessToken = await UserService.getProfile(id, pushToken);

        //! This line is for test
        storage.set(ACCESS_TOKEN, newAccessToken);

        const userData = jwtDecode(newAccessToken) as CurrentUser;

        const [favorites, recipes] = await Promise.all([
          FavoritesService.getFavorties({
            limit: 5,
            page: 0,
            userId: userData.id,
          }),
          RecipeService.getRecipesByUser({
            limit: 5,
            page: 0,
            userId: userData.id,
          }),
        ]);

        //! This line is for test
        await Purchases.logIn(userData.id.toString());

        setFavoritesCount(favorites.length);
        setRecipesCount(recipes.length);

        setUser(userData);
        setError(null);
      }
    } catch (error: any) {
      if ((error.status = 401)) {
        logout();
        return;
      }

      setError(error instanceof Error ? error.message : "Failed to fetch user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        setError,
        login,
        mounted,
        serverHealth,
        favoritesCount,
        setFavoritesCount,
        recipesCount,
        setRecipesCount,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useCurrentUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
