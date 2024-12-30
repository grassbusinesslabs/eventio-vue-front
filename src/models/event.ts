import type {Pagination} from '@/models/pagination'

export interface Event {  
    id: string
    userId: number  
    title: string  
    description: string  
    date: Date | string   
    image: File | string
    city: string
    location: string  
    lat: number 
    lon: number    
    count: number
 }  
 
 export type GetEventsResponse = Pagination<{events: Event[]}>  
 
 export interface AddEventBody {  
     userId: number  
     title: string  
     description: string  
     date: Date | string   
     image?: File | string
     location: string  
     lat: number 
    lon: number   
 } 