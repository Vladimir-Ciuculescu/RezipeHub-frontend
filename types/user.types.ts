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

export interface LoginUserRequest {
  email: string;
  password: string;
}
