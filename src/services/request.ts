import {apiService} from '@/services/api'
import type {AddEventBody, CurrentUser, UpdateUserBody, GetEventsResponse, LoginBody, Event, FindListParams} from '@/models'

export const requestService = () => {
   const api = apiService()

   async function login(body: LoginBody): Promise<CurrentUser> {
      return api.post('/auth/login', body)
   }

   async function getEvents(): Promise<GetEventsResponse> {
      return api.get('/events/findall')
   }
   
   async function findEvents(params: FindListParams): Promise<GetEventsResponse> {
      try {
        const searchParams = new URLSearchParams()
        
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

    async function getEventById(Id: string | number): Promise<Event> {
      return api.get<Event>(`/events/${Id}`);
    }
    async function getEventsByDate(date: string | number): Promise<GetEventsResponse> {
      const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
      const unixTimestamp = Math.floor(dateObj.getTime() / 1000);
      return api.get<GetEventsResponse>(`/events/findbydate?date=${unixTimestamp}`);
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
      findEvents
   }
}
