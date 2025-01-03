export interface LocalPagination<T> {
    events: T[]
    pages: number
    total: number
}

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
    target: HTMLInputElement
 }  
 
 export type GetEventsResponse = LocalPagination<Event>
 
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