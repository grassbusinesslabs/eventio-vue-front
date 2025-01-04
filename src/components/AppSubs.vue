<template>
  <v-col cols="12">
    <v-card>
      <div class="card-container">
        <div class="upper-section">
          <v-img
            :src="getImageUrl"
            :error-src="defaultImage"
            alt="Event Image"
            class="card-image"
            aspect-ratio="1"
            cover
          />
          <div class="info-section">
            <h3 class="card-title" v-if="event?.title">{{ event.title }}</h3>
            
            <p class="card-map" v-if="event?.location">
              <v-icon left>mdi-map-marker</v-icon>
              {{ event.location }}
            </p>
            
            <p class="card-date" v-if="event?.date">
              {{ formatDate(event.date) }}
            </p>
          </div>
        </div>
        <div class="lower-section">
          <p class="card-body">
            <span>{{ event?.description }}</span>
          </p>
          <v-divider></v-divider>
          <v-btn 
            class="button-edit" 
            @click="handleCancelSubscription"
            :loading="loading"
            prepend-icon="mdi-close-circle"
            block
          >
            {{ translate("BTNS.CANCEL_SUBS") }}
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-col>
</template>

<script lang="ts" setup>
import { useAppI18n } from '@/i18n'
import { computed, defineProps, ref } from "vue"
import type { Event } from "@/models"
import { getMonth, getYear, getDate, getHours, getMinutes } from 'date-fns'
import { requestService } from "@/services"

const { translate } = useAppI18n()
const request = requestService()
const loading = ref(false)

const props = defineProps<{
  event: Event | null
}>()

const emit = defineEmits(['subsCanceled'])

const defaultImage = "https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg"

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString)
  const day = getDate(date)
  const month = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
  ][getMonth(date)]
  const year = getYear(date)
  const hours = getHours(date).toString().padStart(2, '0')
  const minutes = getMinutes(date).toString().padStart(2, '0')
  
  return `${day} ${month} ${year} на ${hours}:${minutes}`
}

const getImageUrl = computed(() => {
  if (!props.event?.image) return defaultImage;
  return `https://eventio.grassbusinesslabs.uk/static/${props.event.image}`;
})


const handleCancelSubscription = async () => {
  if (!props.event?.id) {
    return
  }

  loading.value = true

  try {
    const eventId = Number(props.event.id)
    await request.cancelSubs({ 
      event_id: eventId 
    })
    
    emit('subsCanceled')
  } catch (error: any) {
    console.error('Error canceling subscription:', error)
  } finally {
    loading.value = false
  }
}
</script>
  
<style lang="scss" scoped>
.card-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;

  @media (max-width: 768px) {
    padding: 12px;
  }
}

.upper-section {
  display: flex;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
}

.card-image {
  width: 180px;
  height: 140px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
    margin-bottom: 8px;
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
    text-align: center;
  }
}

.card-title {
  margin: 12px 0;
  font-size: 18px;
  font-weight: bold;

  @media (max-width: 768px) {
    margin: 8px 0;
    font-size: 16px;
  }
}

.card-map,
.card-date {
  font-size: 14px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
}

.lower-section {
  padding: 16px 0;

  @media (max-width: 768px) {
    padding: 12px 0;
    text-align: left;
  }
}

.card-body {
  margin-bottom: 16px;
  font-size: 14px;
  color: #555;

  @media (max-width: 768px) {
    font-size: 13px;
    text-align: justify;
  }
}

.button-edit {
  margin-top: 16px;
  padding: 12px;
  font-size: 14px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
    font-size: 13px;
  }
}

.v-snackbar {
  @media (max-width: 768px) {
    bottom: 16px;
    left: 16px;
    right: 16px;
  }
}

</style>