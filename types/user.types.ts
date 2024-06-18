import { SocialProvider } from "./enums";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterUserRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SocialLoginUserRequest {
  provider: SocialProvider;
  providerUserId: string;
  email: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}
