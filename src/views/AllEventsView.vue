<template>
   <home-layout>
     <v-sheet class='mx-auto'>
       <v-row class='ma-0'>
         <h2 class="element">Всі заходи</h2>
       </v-row>
     </v-sheet>
     
     <v-row class="d-flex align-center ma-0">
       <v-col cols="auto">
         <v-btn-toggle v-model="selectedDateValue"
                       @change="handleToggleChange">
           <v-btn value="all" variant="outlined">
             {{ translate('INPUTS.ALL') }}
           </v-btn>
           <v-btn value="past" variant="outlined">
             {{ translate('INPUTS.PAST') }}
           </v-btn>
           <v-btn value="future" variant="outlined">
             {{ translate('INPUTS.FUTURE') }}
           </v-btn>
         </v-btn-toggle>
       </v-col>
       
       <v-col cols="auto" class="d-flex align-center">
         <v-text-field  
           :placeholder="translate('INPUTS.SEARCH')"
           v-model="searchQuery"
           variant="plain"
           class="search-input"
           density="comfortable">
           <v-icon left>mdi-magnify</v-icon>
         </v-text-field>
       </v-col>
       
       <v-col cols="auto">
         <v-btn 
            @click="toggleFilterWindow"
            icon="mdi-filter"
            variant="outlined"
            class="ml-2"
            style="border-color: #ccc;"
         />
      </v-col>
     </v-row>
 
     <v-bottom-sheet v-model="showFilterWindow" persistent>
       <v-card>
         <v-card-title>Фільтрувати всі івенти</v-card-title>
         <v-card-text>
           <v-row>
             <v-col cols="12" md="6">
               <v-select
                 v-model="filterMonth"
                 :items="monthOptions"
                 label="За місяцем проведення"
                 clearable
                 @update:model-value="onMonthSelected"
               />
             </v-col>
             <v-col cols="12" md="6">
               <v-text-field
                 v-model="filterDate"
                 label="За датою проведення"
                 type="date"
                 @update:model-value="onDateSelected"
               />
             </v-col>
           </v-row>
         </v-card-text>
         
         <v-card-actions>
           <v-btn @click="applyFilters" color="primary">
             Застосувати
           </v-btn>
           <v-btn @click="resetFilters" variant="text">
             Скинути
           </v-btn>
           <v-btn @click="showFilterWindow = false" variant="text">
             Закрити
           </v-btn>
         </v-card-actions>
       </v-card>
     </v-bottom-sheet>
 
     <v-row class='ma-0'>
       <app-post
         v-for='event in filteredEvents'
         :key='event.id'
         :event='event'
       />
     </v-row>
   </home-layout>
 </template>
 
 <script lang='ts' setup>
 import type {MaybeRefOrGetter, Ref} from 'vue'
 import {onMounted, ref, computed, watch} from 'vue'
 import { useRoute, useRouter } from 'vue-router'
 import {storeToRefs} from 'pinia'
 import { format, parseISO } from 'date-fns'
 import { uk } from 'date-fns/locale'
 
 import type {GetEventsResponse, Event} from '@/models'
 import {formService, requestService} from '@/services'
 import {useHandleError} from '@/composables'
 import {useAppI18n} from '@/i18n'
 import {useUserStore} from '@/stores'
 import HomeLayout from '@/layouts/HomeLayout.vue'
 import AppPost from '@/components/AppPost.vue'
 
 const {handleError} = useHandleError()
 const {translate} = useAppI18n()
 const userStore = useUserStore()
 const {currentUser} = storeToRefs(userStore)
 
 const request = requestService()
 const {vuetifyConfig, eventTitleValidator, textValidator} = formService()
 
 const events: Ref<Event[]> = ref<Event[]>([])
 const loadingEvents = ref<boolean>(false)
 
 let lastEventId: number = 0
 
 const isSubmitting = ref<boolean>(false)
 
 const selectedDateValue = ref('all')
 const searchQuery = ref<string>('')
 
 // New filter-related refs
 const showFilterWindow = ref(false)
 const filterMonth = ref(null)
 const filterDate = ref(null)
 
 const monthOptions = [
   'Січень', 'Лютий', 'Березень', 'Квітень', 
   'Травень', 'Червень', 'Липень', 'Серпень', 
   'Вересень', 'Жовтень', 'Листопад', 'Грудень'
 ]
 
 const route = useRoute()
 const router = useRouter()
 
 onMounted(() => {
   loadEvents()
 })
 
 watch(route, () => {
   loadEvents()
 })
 
 function onMonthSelected() {
   filterDate.value = null
 }
 
 function onDateSelected() {
   filterMonth.value = null
 }
 
 const filteredEvents = computed(() => {
   return events.value.filter(event => {
     const eventDate = new Date(event.date)
     const matchesSearch =
       event.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
       event.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
 
     const matchesExactDate = 
       !filterDate.value || 
       format(eventDate, 'yyyy-MM-dd') === filterDate.value
 
     const matchesMonth = 
       !filterMonth.value || 
       monthOptions[eventDate.getMonth()] === filterMonth.value
 
     const matchesDateToggle = 
       selectedDateValue.value === 'all' ||
       (selectedDateValue.value === 'past' && eventDate < new Date()) ||
       (selectedDateValue.value === 'future' && eventDate >= new Date())
 
     return matchesSearch && 
            matchesExactDate && 
            matchesMonth && 
            matchesDateToggle
   })
 })
 
 function toggleFilterWindow() {
   showFilterWindow.value = !showFilterWindow.value
 }
 
 function applyFilters() {
   showFilterWindow.value = false
 }
 
 function resetFilters() {
   filterMonth.value = null
   filterDate.value = null
 }
 
 async function loadEvents(): Promise<void> {
   try {
     loadingEvents.value = true
 
     const response: GetEventsResponse = await request.getEvents()
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
 .element {  
   margin: 10px 20px 0px 15px;
 }  
 .search-input {
   padding: 0px 10px;
   font-size: 14px;
   border: 1px solid #ccc;
   border-radius: 4px;
   width: 380px;
   height: 50px;
   margin-left: 0px;
 }
 </style>