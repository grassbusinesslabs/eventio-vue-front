import {apiService} from '@/services/api'
import type {AddEventBody, CurrentUser, UpdateUserBody, GetEventsResponse, LoginBody, Event} from '@/models'

export const requestService = () => {
   const api = apiService()

   async function login(body: LoginBody): Promise<CurrentUser> {
      return api.post('/auth/login', body)
   }

   async function getEvents(): Promise<GetEventsResponse> {
      return api.get('/events/findAll')
   }

   async function addEvent(body: AddEventBody): Promise<Event> {
      return api.post('/events', body)
   }

   async function getCurrentUser(): Promise<CurrentUser> {
      return api.get('/users/me')
   }

   async function logout(): Promise<void> {
      return api.post('/auth/logout')
   }
   async function register(body: Record<string, string>): Promise<any> {
      return api.post('/auth/register', body)
   }
   async function updateUser(id: string, body: UpdateUserBody): Promise<CurrentUser> {
      return api.put(`/users/${id}`, body);
   }

   return {
      login,
      getEvents,
      getCurrentUser,
      logout,
      addEvent,
      register,
      updateUser
   }
}
