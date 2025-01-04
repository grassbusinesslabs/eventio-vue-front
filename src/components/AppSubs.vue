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

    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout"
      :color="snackbar.color"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          class="button"
          variant="text"
          @click="snackbar.show = false"
        >
          Закрити
        </v-btn>
      </template>
    </v-snackbar>
  </v-col>
</template>

<script lang="ts" setup>
import { useAppI18n } from '@/i18n'
import { computed, defineProps, ref } from "vue"
import type { Event } from "@/models"
import { getMonth, getYear, getDate, getHours, getMinutes } from 'date-fns'
import { requestService } from "@/services"

interface Snackbar {
  show: boolean;
  message: string;
  timeout: number;
  color: string;
}

const { translate } = useAppI18n()
const request = requestService()
const loading = ref(false)

const props = defineProps<{
  event: Event | null
}>()

const emit = defineEmits(['subsCanceled'])

const snackbar = ref<Snackbar>({
  show: false,
  message: '',
  timeout: 4000,
  color: 'info'
})

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

const showSnackbar = (message: string, isError = false) => {
  snackbar.value = {
    show: true,
    message,
    timeout: isError ? 5000 : 4000,
    color: isError ? 'error' : 'success'
  }
}

const handleCancelSubscription = async () => {
  if (!props.event?.id) {
    showSnackbar('ID події не вказано', true)
    return
  }

  loading.value = true

  try {
    const eventId = Number(props.event.id)
    await request.cancelSubs({ 
      event_id: eventId 
    })
    
    showSnackbar('Підписку скасовано успішно', false)
    emit('subsCanceled')
  } catch (error: any) {
    console.error('Error canceling subscription:', error)
    showSnackbar(
      error.response?.data?.message || 
      'Помилка при скасуванні підписки. Спробуйте ще раз.',
      true
    )
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
}

.upper-section {
  display: flex;
  padding: 16px;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    align-items: center;
    padding: 12px;
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
    height: 200px;
    margin-bottom: 8px;
  }
}

.info-section {
  display: flex;
  flex-direction: column;
  width: 380px;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 0 8px;
  }
}

.card-title {
  margin: 20px 0 16px 0;
  font-size: 19px;
  font-weight: bold;
  
  @media (max-width: 768px) {
    margin: 8px 0 12px 0;
    font-size: 17px;
    text-align: center;
  }
}

.card-map {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 0 0 8px 0;
  gap: 4px;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
}

.card-date {
  font-size: 14px;
  margin: 0 0 8px 0;
  
  @media (max-width: 768px) {
    text-align: center;
  }
}

.lower-section {
  padding: 0 16px 16px 16px;
  text-align: justify;
  
  @media (max-width: 768px) {
    padding: 0 12px 12px 12px;
  }
}

.card-body {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #555;
  width: 100%;
  
  @media (max-width: 768px) {
    font-size: 13px;
    text-align: left;
    padding: 0 4px;
  }
}

.button {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-right: 3px;
  margin-bottom: 5px;
  
  @media (max-width: 768px) {
    margin: 8px 0;
  }
}

.button-edit {
  width: fit-content;
  margin-top: 10px;
  
  @media (max-width: 768px) {
    width: 100%;
    margin: 8px 0;
    padding: 12px;
    font-size: 14px;
  }
}
</style>