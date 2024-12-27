import {apiService, apiClient} from '@/services/api'
import type {AddEventBody, CurrentUser, UpdateUserBody, GetEventsResponse, LoginBody, Event, FindListParams, GetSubscriptionResponse} from '@/models'
import { authTokenService } from './auth-token'
import axios from 'axios'

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
         if(params.year) searchParams.append('year', params.year.toString())
        if (params.search) searchParams.append('search', params.search)
         if (params.location) searchParams.append('location', params.location)  
        return api.get(`/events/findlistby?${searchParams.toString()}`)
      } catch (error) {
        console.error('Error fetching events:', error)
        throw error
      }
    }
  

   async function addEvent(body: Record<string, any>): Promise<{ id: string }> {
      return api.post('/events', body)
   }

   async function uploadEventImage(Id: string | number, image: File): Promise<void> {
      try {
        const formData = new FormData();
        formData.append('image', image);
    
        const response = await api.post(`/events/uploadimage?Id=${Id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: [(data) => data],
        });
    
        return response.data;
    
      } catch (error: any) {
        if (error.response) {
          throw new Error(
            `Failed to upload image: ${error.response.status} ${error.response.statusText}` +
            (error.response.data ? ` - ${JSON.stringify(error.response.data)}` : '')
          );
        } else if (error.request) {
          throw new Error('No response received from server');
        } else {
          throw new Error(`Error setting up request: ${error.message}`);
        }
      }
    }
    async function uploadUserImage(image: File): Promise<void> {
      try {
        const formData = new FormData();
        formData.append('image', image);
    
        const response = await api.post(`/users/uploaduserimage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: [(data) => data],
        });
    
        return response.data;
    
      } catch (error: any) {
        if (error.response) {
          throw new Error(
            `Failed to upload image: ${error.response.status} ${error.response.statusText}` +
            (error.response.data ? ` - ${JSON.stringify(error.response.data)}` : '')
          );
        } else if (error.request) {
          throw new Error('No response received from server');
        } else {
          throw new Error(`Error setting up request: ${error.message}`);
        }
      }
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

    async function getEventById(id: number | string): Promise<Event> {
      return api.get<GetEventsResponse>(`/events/?Id=${id}`)
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

   async function deleteEvent(Id: number | string): Promise<Event> {
      return api.del<GetEventsResponse>(`/events/delete?Id=${Id}`)
   }

    async function updateEvent(id: number | string, body: Record<string, any>): Promise<Event>  {
      return api.put(`/events/update?Id=${id}`, body)
   }

   async function subscribe(event_id: number): Promise<GetSubscriptionResponse> {
      try {
          const response = await api.post('/subscription', {
              event_id: event_id
          });
          console.log('Response:', response)
          return response;
      } catch (error) {
         
          if (axios.isAxiosError(error)) {
              console.log('Error details:', error.response?.data)
              console.log('Error status:', error.response?.status)
              console.log('Error headers:', error.response?.headers)
          }
          throw error;
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
      setAuthHeader,
      deleteEvent,
      uploadEventImage,
      updateEvent,
      subscribe,
      uploadUserImage
   }
}
