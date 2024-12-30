import { CurrentUser } from "./user"

export interface LoginBody {
   email: string
   password: string
}

export interface UpdateUserBody{
   firstName: string
   secondName: string
   email: string
}

export interface RegisterResponse {
   token: string
   user: CurrentUser
}