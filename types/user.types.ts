import { SocialProvider } from "./enums";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CurrentUser extends User {
  iat: number;
  exp: number;
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
  firstName: string;
  lastName: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  token: string;
}
