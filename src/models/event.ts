import type {Pagination} from '@/models/pagination'

export interface Event {  
    id: number  
    userId: number  
    title: string  
    description: string  
    date: Date | string   
    image: string  
    location: string  
    lat: number 
    lon: number 
    created_date: Date  
    updated_date?: Date  
    deleted_date?: Date | null    
 }  
 
 export type GetEventsResponse = Pagination<{events: Event[]}>  
 
 export interface AddPostBody {  
     userId: number  
     title: string  
     description?: string  
     date: Date | string   
     image?: string  
     location: string  
     lat: number  
     lon: number  
     created_date?: Date  
     updated_date?: Date 
 } 