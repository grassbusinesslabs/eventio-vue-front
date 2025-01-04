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
  console.log("Page: ", page)
  
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

<style lang='scss' scoped>
.event-details-card {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
}

.event-image {
  height: 300px;
  width: 100%;
}

.card-content {
  padding: 0;
}

.event-title {
  font-size: 24px;
  font-weight: bold;
  margin: 15px 20px 10px;
  line-height: 1.3;
}

.event-description {
  text-align: justify;
  font-size: 16px;
  margin: 0 20px 20px;
}

.event-location,
.event-date {
  font-size: 16px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.event-location {
  margin-bottom: 5px;
}

.event-date {
  margin-bottom: 40px;
}

.map {
  width: calc(100% - 40px);
  margin: 0 20px;
}

.card-actions {
  padding: 0;
}

.accept-button {
  margin: 0 20px 20px auto;
}

  @media screen and (max-width: 600px) {
  .event-details-card {
    max-width: 100%;
  }

  .event-image {
    height: 200px;
  }

  .event-title {
    font-size: 20px;
    margin: 10px 12px 6px;
  }

  .event-description,
  .event-location,
  .event-date {
    font-size: 14px;
    margin-left: 12px;
    margin-right: 12px;
  }

  .event-date {
    margin-bottom: 20px;
  }

  .map {
    width: calc(100% - 24px);
    margin: 0 12px;
  }

  .accept-button {
    margin: 0 12px 12px auto;
    font-size: 14px;
  }
}

/* Small Mobile Styles */
@media screen and (max-width: 400px) {
  .event-image {
    height: 180px;
  }

  .event-title {
    font-size: 18px;
    margin: 8px 10px 6px;
  }

  .event-description,
  .event-location,
  .event-date {
    font-size: 13px;
    margin-left: 10px;
    margin-right: 10px;
  }

  .map {
    width: calc(100% - 20px);
    margin: 0 10px;
  }

  .accept-button {
    margin: 0 10px 10px auto;
    font-size: 13px;
  }
}
  </style>
  