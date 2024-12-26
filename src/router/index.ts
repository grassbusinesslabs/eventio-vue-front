import type {RouteRecordRaw, RouterOptions} from 'vue-router'
import {createRouter, createWebHistory, RouteLocationNormalized} from 'vue-router'

import {authTokenService} from '@/services'
import {useToastDialog} from '@/composables'
import SignInView from '@/views/SignInView.vue'
import RegistrationView from '@/views/RegistrationView.vue'
import ErrorView from '@/views/ErrorView.vue'
import AllEvents from '@/views/AllEventsView.vue'
import MyEvents from '@/views/MyEventsView.vue'
import AllEventsView from '@/views/AllEventsView.vue'
import MyEventsView from '@/views/MyEventsView.vue'
import AddEventView from '@/views/AddEventView.vue'
import EventPageView from '@/views/EventPageView.vue'
import ProfilePage from '@/views/ProfilePage.vue'

const toastDialog = useToastDialog()
const authToken = authTokenService()

const routes: RouteRecordRaw[] = [
   {
      path: '/sign-in/',
      name: 'SignIn',
      component: SignInView,
      alias: '/',
      meta: {auth: false}
   },
   {
      path: '/events',
      name: 'Events',
      component: AllEventsView,
      meta: {auth: true}
   },
   {
      path: '/event',
      name: 'EventDetails',
      component: EventPageView,
      meta: {auth: true}
    },
   {
      path: '/myEvents',
      name: 'MyEvents',
      component: MyEventsView,
      meta: {auth: true}
   },
   {
      path: '/profile',
      name: 'Profile',
      component: ProfilePage,
      meta: {auth: true}
    },
   {
      path: '/:all(.*)*',
      name: 'all',
      component: ErrorView
   },
   {
      path: '/addEvent',
      name: 'AddEvent',
      component: AddEventView,
      meta: {auth: true}
   },
   {
   path: '/registration',
   name: 'Registration',
   component: () => import('@/views/RegistrationView.vue'),
   alias: '/',
   meta: {auth: false}
   }
] as RouteRecordRaw[]

const router = createRouter({
   history: createWebHistory(),
   routes
} as RouterOptions)

router.beforeEach(async (to: RouteLocationNormalized) => {
   try {
      const metaAuth: boolean = (to.meta as any).auth as boolean
      const authTokenValue: string | null = await authToken.get()
      if (typeof metaAuth as any !== 'boolean') {
         return true
      }

      if (!authTokenValue && metaAuth) {
         return {name: 'SignIn'}
      }

      if (authTokenValue && !metaAuth) {
         return {name: 'Events'}
      }

      return true
   } catch (e) {
      console.error(e)
      toastDialog.error(e)
      return false
   }
})

export default router
