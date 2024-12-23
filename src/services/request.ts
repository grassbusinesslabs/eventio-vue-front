import {apiService, apiClient} from '@/services/api'
import type {AddEventBody, CurrentUser, UpdateUserBody, GetEventsResponse, LoginBody, Event, FindListParams} from '@/models'
import { authTokenService } from './auth-token'

export const requestService = () => {
   const api = apiService()

   async function login(body: LoginBody): Promise<CurrentUser> {
      const response = await api.post('/auth/login', body)
      const { token, user } = response
      if (token) {
       
         await authTokenService().set(token)
         setAuthHeader(token)
         console.log(token)
      } else {
         console.log("Token not received during registration");
      }
      return user;
   }

   async function getEvents(): Promise<GetEventsResponse> {
      return api.get('/events/findall')
   }
   
   async function findEvents(params: FindListParams): Promise<GetEventsResponse> {
      try {
        const searchParams = new URLSearchParams()

        if(params.city) searchParams.append('city', params.city.toString())
        if (params.day) searchParams.append('day', params.day.toString())
        if (params.month) searchParams.append('month', params.month.toString())
        if (params.title) searchParams.append('title', params.title)
  
        return api.get(`/events/findlist?${searchParams.toString()}`)
      } catch (error) {
        console.error('Error fetching events:', error)
        throw error
      }
    }
  

   async function addEvent(body: Record<string, any>): Promise<Event> {
      return api.post('/events', body)
   }

   async function getCurrentUser(): Promise<CurrentUser> {
      return api.get('/users')
   }

   async function logout(): Promise<void> {
      await api.post('/auth/logout')
      setAuthHeader(null)
   }
   async function register(body: Record<string, string>): Promise<any> {
      const response = await api.post('/auth/register', body);
      const { token, user } = response
      if (token) {
         
         await authTokenService().set(token)
         setAuthHeader(token)
      } else {
         console.log("Token not received during registration");
      }
      return user
   }
   async function updateUser(body: UpdateUserBody): Promise<CurrentUser> {
      return api.put(`/users`, body)
   }

   async function getMyEvents(): Promise<GetEventsResponse> {
      return api.get<GetEventsResponse>('/events/findbyuser')
    }

    async function getEventById(Id: number | string): Promise<Event> {
      return api.get(`/events/?Id=${Id}`)
    }

    async function getEventsByDate(date: string | number): Promise<GetEventsResponse> {
      const dateObj = typeof date === 'string' ? new Date(date) : new Date(date)
      const unixTimestamp = Math.floor(dateObj.getTime() / 1000)
      return api.get<GetEventsResponse>(`/events/findbydate?date=${unixTimestamp}`)
    }
     function setAuthHeader(token: string | null): void {
      if (token) {
         apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
         delete apiClient.defaults.headers.common['Authorization'];
      }
   }
   return {
      login,
      getEvents,
      getCurrentUser,
      logout,
      addEvent,
      register,
      updateUser,
      getMyEvents,
      getEventById,
      getEventsByDate,
      findEvents,
      setAuthHeader
   }
}
