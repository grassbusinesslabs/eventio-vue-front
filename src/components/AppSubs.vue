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
          </div>
        </div>
      </v-card>
    </v-col>
  </template>
  
  
  
  <script lang="ts" setup>
  import { computed, defineProps } from "vue"
  import type { Event } from "@/models"
  import { getMonth, getYear, getDate, getHours, getMinutes } from 'date-fns'
  
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
    font-weight: bold;
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