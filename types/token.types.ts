export interface ResendTokenRequest {
  userId: number;
  email: string;
}

export interface ConfirmTokenRequest {
  userId: number;
  token: string;
}
