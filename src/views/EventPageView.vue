<template>
  <profile-layout>
    <v-card class="event-details-card" v-if="eventsLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-card>

    <v-card class="event-details-card" v-else-if="event">
      <v-img :src="defaultImage" alt="Event Image" aspect-ratio="1.7" cover></v-img>
      <v-card-title class="event-title"
      style="white-space: normal; word-break: break-word;">{{ event?.title }}</v-card-title>
      <v-card-text>
        <p class="event-location" v-if="event?.location"><v-icon left>mdi-map-marker</v-icon>{{ event.location }}</p>
        <p class="event-date" v-if="event?.date"><v-icon left>mdi-calendar</v-icon>{{ formatDate(event.date) }}</p>
        <p class="event-description">{{ event?.description }}</p>
        <v-divider></v-divider>
        <app-map />
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" color="success"><v-icon left>mdi-check-circle</v-icon>Підтвердити участь</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else class="error-card">
      <v-card-text>Івент не знайдено</v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" color="primary" @click="goBack">Назад</v-btn>
      </v-card-actions>
    </v-card>
</profile-layout>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppI18n } from '@/i18n'
import { requestService } from '@/services'
import type { Event } from '@/models'
import ProfileLayout from '@/layouts/ProfileLayout.vue'
import AppMap from '@/components/AppMap.vue'

const router = useRouter()
const event = ref<Event | null>(null)
const eventsLoading = ref(true)
const request = requestService()
const defaultImage = "https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg"
const eventId = localStorage.getItem('eventId')

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('uk-UA').format(date)
}

const loadEventDetails = async () => {
  if (!eventId) return
  eventsLoading.value = true
  
  try {
    const response = await request.findEvents({})
    if (response.events) {
      event.value = response.events.find(e => String(e.id) === String(eventId)) || null
    }
  } catch (error) {
    console.error('Error:', error)
    event.value = null
  } finally {
    eventsLoading.value = false
  }
}

onMounted(loadEventDetails)

const goBack = () => router.back()
</script>
  <style scoped>
  .event-details-card {
    
    max-width: 800px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  }
  
  .event-image {
    height: 300px;
  }
  
  .event-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
    margin-top: 15px;
    margin-left: 20px;
    margin-right: 20px;
  }
  

  .event-description{
    text-align: justify;
   
    margin-left: 20px;
    margin-right: 20px;
  }
  .event-location{
    margin-bottom: 5px;
    font-size: 16px;
    margin-left: 20px;
  }
  .event-date {
    margin-bottom: 15px;
    font-size: 16px;
    width: 100%;
    margin-left: 20px;
  }
  
  .event-location v-icon,
  .event-date v-icon {
    margin-right: 5px;
  }
  </style>
  