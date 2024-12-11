import {useRouter} from 'vue-router'

export const useRouting = () => {
   const router = useRouter()

   async function toSignIn() {
      return router.push('/sign-in')
   }

   async function toAllEvents() {
      return router.push('/events')
   }
   async function toRegistration() {
      return router.push('/registration')
   }
   return {
      toSignIn,
      toAllEvents,
      toRegistration
   }
}
