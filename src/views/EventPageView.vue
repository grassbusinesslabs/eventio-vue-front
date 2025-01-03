<template>
  <profile-layout>
    <v-card class="event-details-card" v-if="eventsLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </v-card>
    <v-card class="event-details-card" v-else-if="event">
      <v-img 
        :src="getEventImage" 
        :alt="event.title || 'Event Image'" 
        aspect-ratio="1.7" 
        cover
      ></v-img>
      <v-card-title
        class="event-title"
        style="white-space: normal; word-break: break-word;"
      >
        {{ event?.title }}
      </v-card-title>
      <v-card-text>
        <p class="event-location" v-if="event?.location">
          <v-icon left>mdi-map-marker</v-icon>{{ event.location }}
        </p>
        <p class="event-date" v-if="event?.date">
          <v-icon left>mdi-calendar</v-icon>{{ formatDate(event.date) }}
        </p>
        <p class="event-description">{{ event?.description }}</p>

        <app-map  class="map"
    v-if="event?.lat && event?.lon"
    :lat="Number(event.lat)" 
    :lon="Number(event.lon)" 
  />
      </v-card-text>
      <v-card-actions>
        <v-btn class="accept-button ml-auto" size="large" elevation="2" @click="acceptSubscription">
          <v-icon left>mdi-check-circle</v-icon>Підтвердити участь
        </v-btn>
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
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { requestService } from '@/services'
import type { Event} from '@/models'
import ProfileLayout from '@/layouts/ProfileLayout.vue'
import AppMap from '@/components/AppMap.vue'


const router = useRouter()
const event = ref<Event | null>(null)
const eventsLoading = ref(true)
const request = requestService()
const defaultImage =
  'https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg'
const eventId = localStorage.getItem('eventId')

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('uk-UA').format(date)
}
const page = localStorage.getItem('currentPage') || '1'

const loadEventDetails = async () => {
  if (!eventId) return
  eventsLoading.value = true
  
  try {
    const params = {
      page: parseInt(page, 10) 
    }
    const response = await request.findEvents(params)
    if (response.events) {
      const foundEvent = response.events.find((e) => String(e.id) === String(eventId)) || null
      console.log('Found event with coordinates:', foundEvent)
      event.value = foundEvent
    }
  } catch (error) {
    console.error('Error:', error)
    event.value = null
  } finally {
    eventsLoading.value = false
  }
}

const getEventImage = computed(() => {
  if (!event.value) return defaultImage
  return event.value.image 
    ? `https://eventio.grassbusinesslabs.uk/static/${event.value.image}`
    : defaultImage
})

onMounted(loadEventDetails)



const goBack = () => {
  router.back()
  localStorage.setItem('eventId', "")}

  const acceptSubscription = async () => {
    if (!eventId) {
        throw new Error('ID події не вказано');
    }

    const numericEventId = parseInt(eventId, 10);
    
    try {
        const response = await request.subscribe(numericEventId);
        if (!response?.user_id) {
            throw new Error('Ви вже підписані на цю подію');
        }
        
        router.push('/events');
    } catch (error) {
        console.error('Помилка під час підписки:', error);
        throw new Error('Сталася помилка під час підписки. Спробуйте ще раз.');
    }
};
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
    font-size: 16px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
  }
  .event-location{
    margin-bottom: 5px;
    font-size: 16px;
    margin-left: 20px;
  }
  .event-date {
    margin-bottom: 40px;
    font-size: 16px;
    width: 100%;
    margin-left: 20px;
  }
  
  .event-location v-icon,
  .event-date v-icon {
    margin-right: 5px;
  }
  .map{
    width: 680px;
    margin-left: 20px;
  }
  .accept-button{
    margin-right: 20px;
    margin-bottom: 20px;
  }

  </style>
  