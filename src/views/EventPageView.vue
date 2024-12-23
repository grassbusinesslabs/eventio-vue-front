<template>
    <v-container>
      <v-card class="event-details-card">
        <v-img
          :src="event?.image || defaultImage"
          alt="Event Image"
          aspect-ratio="1.7"
          cover
          class="event-image"
        ></v-img>
  
        <v-card-title class="event-title">{{ event?.title || 'Деталі івенту' }}</v-card-title>
  
        <v-card-text>
          <p class="event-location" v-if="event?.location">
            <v-icon left>mdi-map-marker</v-icon>
            {{ event.location }}
          </p>
  
          <p class="event-description">{{ event?.description }}</p>
  
          <v-divider></v-divider>
  
          <p class="event-date" v-if="event?.date">
            <v-icon left>mdi-calendar"></v-icon>
            {{ formatDate(event.date) }}
          </p>
        </v-card-text>
  
        <v-card-actions>
          <v-btn variant="outlined" color="primary" @click="goBack">
            <v-icon left>mdi-arrow-left</v-icon> Назад
          </v-btn>
          <v-btn variant="contained" color="success">
            <v-icon left>mdi-check-circle"></v-icon> Підтвердити участь
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAppI18n } from '@/i18n'
  import { requestService } from '@/services'
  import type { Event } from '@/models'
  
  const route = useRoute()
  const router = useRouter()
  const { translate } = useAppI18n()
  
  const request = requestService()
  const event = ref<Event | null>(null)
  
  const defaultImage =
    'https://via.placeholder.com/800x400?text=Image+Unavailable'
  
  const formatDate = (dateString: string | Date): string => {
    const date = new Date(dateString)
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Intl.DateTimeFormat('uk-UA').format(date)
  }
  
  const loadEventDetails = async () => {
    const eventId = route.params.id
    try {
      const response = await request.getEventById(eventId)
      event.value = response
    } catch (error) {
      console.error('Error loading event details:', error)
      event.value = null
    }
  }
  
  const goBack = () => {
    router.back()
  }
  
  onMounted(() => {
    loadEventDetails()
  })
  </script>
  
  <style scoped>
  .event-details-card {
    margin: 20px auto;
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
  }
  
  .event-location,
  .event-description,
  .event-date {
    margin-bottom: 15px;
    font-size: 16px;
  }
  
  .event-location v-icon,
  .event-date v-icon {
    margin-right: 5px;
  }
  </style>
  