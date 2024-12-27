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
            
            <p class="card-members-number">
              Кількість учасників: 0
            </p>
          </div>
        </div>
        <div class="lower-section">
          <p class="card-body">
            <span>{{ event?.description }}</span>
          </p>

          <v-divider></v-divider>
          
          <v-row class="button-row">
            <v-btn class="button-edit" @click="navigateToEditing">
              {{ translate("BTNS.EDIT") }}
            </v-btn>
            <v-btn 
            class="button-delete" 
            @click="showDeleteDialog = true"
            :loading="isDeleting"
          >
            {{ translate("BTNS.DELETEEV") }}
          </v-btn>
          </v-row>
        </div>
      </div>
    </v-card>
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-center">
          {{ translate('DIALOGS.DELETE_EVENT_TITLE') }}
        </v-card-title>
        <v-card-text>
          {{ translate('DIALOGS.DELETE_EVENT_CONFIRM') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="grey" 
            variant="text" 
            @click="showDeleteDialog = false"
          >
            {{ translate('BTNS.CANCEL') }}
          </v-btn>
          <v-btn
            color="error"
            @click="deleteEvent"
            :loading="isDeleting"
          >
            {{ translate('BTNS.DELETE') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
</template>



<script lang="ts" setup>
import { computed, defineProps, ref } from "vue"
import { useAppI18n } from "@/i18n"
import type { Event } from "@/models"
import { getMonth, getYear, getDate, getHours, getMinutes } from 'date-fns'
import { requestService } from '@/services'
import { useHandleError } from '@/composables'
import router from "@/router"

const request = requestService()
const { handleError } = useHandleError()
const { translate } = useAppI18n()

const props = defineProps<{
  event: Event | null
}>()

const emit = defineEmits(['eventDeleted'])

const showDeleteDialog = ref(false)
const isDeleting = ref(false)

const defaultImage = "https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg"

const deleteEvent = async () => {
  if (!props.event?.id) return

  try {
    isDeleting.value = true
    await request.deleteEvent(props.event.id)
    showDeleteDialog.value = false
    emit('eventDeleted')
  } catch (error) {
    handleError(error)
  } finally {
    isDeleting.value = false
  }
}

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

const navigateToEditing = () => {
  if (props.event?.id) {
    localStorage.setItem('eventId', props.event.id)
    router.push({ name: 'AddEvent' })
  }
}
const getImageUrl = computed(() => {
  if (!props.event?.image) return defaultImage;
  return `https://eventio.grassbusinesslabs.uk/static/${props.event.image}`;
});
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
}

.card-image {
  width: 180px;
  height: 140px;
  flex-shrink: 0;
  border-radius: 4px;
  align-self: end;
  overflow: hidden;
}

.info-section {
  display: flex;
  flex-direction: column;
  width: 380px;
  flex-grow: 1;
}

.card-title {
  margin: 20px 0 16px 0;
  font-size: 19px;
  font-weight: bold;
}

.card-map {
  display: flex;
  align-items: center;
  font-size: 14px;
  margin: 0 0 8px 0;
  gap: 4px;
}

.card-date {
  font-size: 14px;
  margin: 0 0 8px 0;
}

.card-members-number {
  font-size: 14px;
  margin: 0;
}

.lower-section {
  padding: 0 16px 16px 16px;
  text-align: justify;
}

.card-body {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #555;
  width: 100%;
}

.button-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  margin-right: 3px;
  margin-bottom: 5px;
}

.button-delete {
  width: fit-content;
  color: darkred;
}
.button-edit {
  width: fit-content;
  margin-right: 10px;
}
</style>