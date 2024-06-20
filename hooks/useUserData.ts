import { ACCESS_TOKEN, storage } from "@/storage";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { CurrentUser } from "@/types/user.types";

const useUserData = () => {
  const [userData, setUserData] = useState<CurrentUser>();

  useEffect(() => {
    const accessToken = storage.getString(ACCESS_TOKEN);

    if (accessToken) {
      try {
        const userData = jwtDecode(accessToken) as CurrentUser;

        setUserData(userData);
      } catch (error) {
        console.error("Failed to parse user data from token:", error);
      }
    }
  }, []);

  return userData;
};

export default useUserData;
