import {apiService} from '@/services/api'
import type {AddEventBody, CurrentUser, UpdateUserBody, GetEventsResponse, LoginBody, Event} from '@/models'

export const requestService = () => {
   const api = apiService()

   async function login(body: LoginBody): Promise<CurrentUser> {
      return api.post('/auth/login', body)
   }

   async function getEvents(): Promise<GetEventsResponse> {
      return api.get('/events/findall')
   }

   async function addEvent(body: Record<string, any>): Promise<Event> {
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
   async function updateUser(body: UpdateUserBody): Promise<CurrentUser> {
      return api.put(`/users`, body);
   }

   async function getMyEvents(): Promise<GetEventsResponse> {
      return api.get<GetEventsResponse>('/events/findbyuser');
    }

   return {
      login,
      getEvents,
      getCurrentUser,
      logout,
      addEvent,
      register,
      updateUser,
      getMyEvents
   }
}
