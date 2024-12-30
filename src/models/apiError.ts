import { CurrentUser } from "./user";

export interface ApiError {
    status: number;
    message: string;
    code?: string;
  }
  
 export interface LoginResponse {
    token: string;
    user: CurrentUser;
  }