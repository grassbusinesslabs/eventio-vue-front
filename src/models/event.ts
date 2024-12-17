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
 }  
 
 export type GetEventsResponse = Pagination<{events: Event[]}>  
 
 export interface AddEventBody {  
     userId: number  
     title: string  
     description: string  
     date: Date | string   
     image?: string  
     location: string  
     lat: number 
    lon: number   
 } 