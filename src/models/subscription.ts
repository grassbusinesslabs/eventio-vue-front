import type {Pagination} from '@/models/pagination'

export interface Subscription {
   user_id: number
    event_id: number
}

export interface GetSubscriptionResponse {
    user_id: number;
    event_id: number;
}