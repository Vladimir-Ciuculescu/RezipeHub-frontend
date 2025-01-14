import { SocialProvider } from "./enums";

export interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  bio?: string;
  iat: number;
  exp: number;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface CurrentUser extends User {
  iat: number;
  exp: number;
  isVerified: boolean;
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
  deviceToken: string;
  platform: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
  deviceToken: string;
  platform: string;
}

export interface LoginUserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  photoUrl?: string;
  bio: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  token: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  photoUrl: string;
}
