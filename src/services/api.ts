import type {
   AxiosInstance,
   AxiosRequestConfig,
   AxiosResponse,
   CreateAxiosDefaults,
   InternalAxiosRequestConfig
 } from 'axios'
 import axios from 'axios'
 import { ref } from 'vue'
 import { authTokenService } from '@/services/auth-token'
 
 const apiUrls = [
   { title: 'Production URL', value: 'https://eventio.grassbusinesslabs.uk/api/v1' },
   { title: 'Development URL', value: 'https://eventio-alusium.grassbusinesslabs.uk/api/v1' },
   { title: 'Staging URL', value: 'https://staging-eventio.grassbusinesslabs.uk/api/v1' },
   // Add more URLs as needed
 ]
 
 const currentApiUrl = ref(apiUrls[0].value)
 
 export const apiService = () => {
   const authToken = authTokenService()
 
   const instance: AxiosInstance = axios.create({
     get baseURL() { 
       return currentApiUrl.value
     },
     headers: {
       'Content-Type': 'application/json',
       'Accept': 'application/json'
     }
   } as CreateAxiosDefaults)
 
   instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
     const token: string | null = await authToken.get()
     if (token) {
       config.headers!['Authorization'] = `Bearer ${token}`
     }
     config.baseURL = currentApiUrl.value // Update baseURL on each request
     return config
   })
 
   async function get<T = any, R = any>(url: string, config?: AxiosRequestConfig<T>): Promise<R> {
     return formattingResponse(await instance.get(url, config as AxiosRequestConfig<T>))
   }
 
   async function post<T = any, R = any>(url: string, data?: T, config?: AxiosRequestConfig<T>): Promise<R> {
     return formattingResponse(await instance.post(url, data, config as AxiosRequestConfig<T>))
   }
 
   async function put<T = any, R = any>(url: string, data?: T, config?: AxiosRequestConfig<T>): Promise<R> {
     return formattingResponse(await instance.put(url, data, config as AxiosRequestConfig<T>))
   }
 
   async function del<T = any, R = any>(url: string, config?: AxiosRequestConfig<T>): Promise<R> {
     return formattingResponse(await instance.delete(url, config as AxiosRequestConfig<T>))
   }
 
   function formattingResponse<T = any>(response: AxiosResponse<T>): T {
     return response.data
   }
 
   const setApiUrl = (url: string) => {
     currentApiUrl.value = url
   }
 
   return {
     apiUrls,
     currentApiUrl,
     setApiUrl,
     instance,
     apiClient: instance,
     get,
     post,
     put,
     del
   }
 }
 
 export const apiClient = apiService().apiClient;