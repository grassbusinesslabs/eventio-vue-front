<template>
    <home-layout>
      <v-row 
      align="center" class="no-spacing">
         <h2 class="header">{{ events.length }} подій</h2>
      <v-btn
        class="ma-3"
        text to="/addEvent"
      >
        <v-icon
          icon="mdi-plus-circle"
          start
        ></v-icon>
        {{translate("BTNS.ADD_EVENT")}}
      </v-btn>
   </v-row>
       <v-row class='ma-0'>
          <app-post
            v-for='event in events'
            :key='event.id'
            :event='event'
          />
       </v-row>
    </home-layout>
 </template>
 <script lang='ts' setup>
 import type {MaybeRefOrGetter, Ref} from 'vue'
 import {onMounted, ref, computed, watch} from 'vue'
 import {useRoute, useRouter } from 'vue-router'
 import {useForm} from 'vee-validate'
 import {toTypedSchema} from '@vee-validate/yup'
 import {storeToRefs} from 'pinia'
 import * as yup from 'yup'
 import type {GetEventsResponse, Event} from '@/models'
 import type {AddPostBody, GetPostsResponse, Post} from '@/models'
 import {formService, requestService} from '@/services'
 import {useHandleError} from '@/composables'
 import {useAppI18n} from '@/i18n'
 import {useUserStore} from '@/stores'
 import HomeLayout from '@/layouts/HomeLayout.vue'
 import AppPost from '@/components/AppMyPost.vue'
 
 const {handleError} = useHandleError()
 const {translate} = useAppI18n()
 const userStore = useUserStore()
 const {currentUser} = storeToRefs(userStore)

 const events: Ref<Event[]> = ref<Event[]>([])
 const loadingEvents = ref<boolean>(false)
 
 let lastEventId: number = 0

 const request = requestService()
 const {vuetifyConfig, eventTitleValidator, textValidator} = formService()

 
 let lastPostId: number = 0
 
 const form = useForm({
    validationSchema: toTypedSchema(
       yup.object({
          title: eventTitleValidator(),
          text: textValidator()
       })
    ),
    initialValues: {
       title: '',
       text: ''
    }
 })
 
 const isSubmitting = ref<boolean>(false)
 const [title, titleAttrs] = form.defineField('title' as MaybeRefOrGetter, vuetifyConfig)
 const [text, textAttrs] = form.defineField('text' as MaybeRefOrGetter, vuetifyConfig)
 
 const route = useRoute()

 onMounted(() => {
   loadEvents()
 })
 
 watch(route, () => {
   loadEvents()
 })
 
 async function loadEvents(): Promise<void> {
    try {
      loadingEvents.value = true
 
     const response: GetEventsResponse = await request.getMyEvents()
     events.value = response.events || [] 
     lastEventId = response.total
 
   } catch (e) {
     console.error(e)
     handleError(e)
     events.value = []
   } finally {
     loadingEvents.value = false
    }
 }
 </script>
 
 <style lang='scss' scoped>
 .header{
   margin-left: 40px;
   font-weight: normal;}
 </style>
 