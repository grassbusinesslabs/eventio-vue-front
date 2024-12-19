<template>
   <home-layout>
     <v-sheet class='mx-auto'>
       <v-row class='ma-0'>
       </v-row>
     </v-sheet>
     
     <v-row class="d-flex align-center ma-0">
       
       
       <v-col cols="auto" class="d-flex align-center">
         <v-text-field  
           :placeholder="translate('INPUTS.SEARCH')"
           v-model="searchQuery"
           variant="plain"
           class="search-input"
           density="comfortable"
           clearable>
           <v-icon left>mdi-magnify</v-icon>
         </v-text-field>
       </v-col>
       <v-icon color="#3E3B3BFF">mdi-calendar</v-icon>
       <v-col  cols="auto" class="d-flex align-center">
               <v-select
                 v-model="filterDay"
                 :items="dayOptions"
                 class="day-input"
                 label="День"
                 density="compact"
                 width="10px"
                 clearable
               />
             </v-col>
       <v-col  cols="auto" class="d-flex align-center">
               <v-select
                 v-model="filterMonth"
                 :items="monthOptions"
                 class="month-input"
                 label="Місяць"
                 density="compact"
                 clearable
                 @update:model-value="onMonthSelected"
               />
             </v-col>
        <v-col  cols="auto" class="d-flex align-center">
               <v-select
                 v-model="filterYear"
                 :items="yearOptions"
                 class="year-input"
                 label="Рік"
                 density="compact"
                 clearable
               />
             </v-col>
     </v-row>
 
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
 const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)
const yearOptions = [2024, 2025, 2026]

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
 
 async function applyFilters() {
  showFilterWindow.value = false
  loadingEvents.value = true

  try {
    let response: GetEventsResponse

    if (filterDate.value) {
      response = await request.getEventsByDate(filterDate.value)
    } else {

      response = await request.getEvents()
    }

    events.value = response.events || []
    lastEventId = response.total
  } catch (error) {
    console.error('Error loading filtered events', error)
    handleError(error)
  } finally {
    loadingEvents.value = false
  }
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
   margin-right: 65px;
 }
 .month-input {
   padding: 5px 5px;
   font-size: 14px;
   border: 1px solid #ccc;
   border-radius: 4px;
   height: 50px;
   width: 180px;
   margin-left: 0px;
   margin-left: -15px;

 }
 .day-input{
  padding: 5px 5px;
   font-size: 14px;
   border: 1px solid #ccc;
   border-radius: 4px;
   height: 50px;
   width: 115px;
   margin-left: 0px;
 }
 .year-input{
  padding: 5px 5px;
   font-size: 14px;
   border: 1px solid #ccc;
   border-radius: 4px;
   height: 50px;
   width: 130px;
   margin-left: -15px;
 }
 </style>