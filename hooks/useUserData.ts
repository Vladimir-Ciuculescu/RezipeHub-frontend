import { ACCESS_TOKEN, storage } from "@/storage";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { CurrentUser, UserData } from "@/types/user.types";

const useUserData = (): UserData => {
  const accessToken = storage.getString(ACCESS_TOKEN);

  let user: any = {};

  if (accessToken) {
    try {
      const userData = jwtDecode(accessToken) as CurrentUser;

      user = userData;
    } catch (error) {
      console.error("Failed to parse user data from token:", error);
    }
  }

  return user;
};

export default useUserData;
