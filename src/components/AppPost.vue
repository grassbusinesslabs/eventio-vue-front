<template>
  <v-col cols="12">
    <v-card 
      class="d-flex align-center"
      :style="{ 
        backgroundColor: isPastEvent ? '#f5f5f5' : 'white',
        opacity: isPastEvent ? '0.8' : '1'
      }"
    >
    <v-img
          :src="getImageUrl"
          :error-src="defaultImage"
          alt="Event Image"
          class="card-image"
          
          aspect-ratio="1"
          cover
        />

      <v-card-text class="text-content">
        <h3 class="card-title" v-if="event?.title">{{ event.title }}</h3>

        <p class="card-map" v-if="event?.location">
          <v-icon left>mdi-map-marker</v-icon>
          {{ event.location }}
        </p>

        <p class="card-body">
          <span v-if="!isExpanded">{{ truncatedBody }}</span>
          <span v-else>{{ event?.description }}</span>
        </p>

        <v-divider></v-divider>
        <v-row class="d-flex align-end ma-1">
          <p class="card-date" v-if="event?.date">
            {{ formatDate(event.date) }}
          </p>
          <v-btn 
            class="button-join ml-auto"
            append-icon="mdi-arrow-right"
            @click="navigateToEventDetails"
            :style="{
              backgroundColor: isPastEvent ? '#D7D7D7FF' : undefined
            }"
          >
            {{ isPastEvent ? translate("BTNS.VIEW_DETAILS") : translate("BTNS.JOIN") }}
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts" setup>
import { defineProps } from "vue"
import { ref, computed } from "vue"
import { useAppI18n } from "@/i18n"
import type { Event } from "@/models"
import { getMonth, getYear, getDate, getHours, getMinutes } from 'date-fns'
import { useRouter } from 'vue-router'

const router = useRouter()
const { translate } = useAppI18n()

const props = defineProps<{
  event: Event
}>()

const isExpanded = ref(false)
const defaultImage = "https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg"

const isPastEvent = computed(() => {
  if (!props.event?.date) return false;
  return new Date(props.event.date) < new Date();
});

const truncatedBody = computed(() => {
  const maxLength = 150;
  return props.event?.description && props.event.description.length > maxLength
    ? props.event.description.slice(0, maxLength) + "..."
    : props.event?.description || ""
})

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);

  const day = getDate(date);
  const month = [
    'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
    'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
  ][getMonth(date)];
  const year = getYear(date);
  const hours = getHours(date).toString().padStart(2, '0');
  const minutes = getMinutes(date).toString().padStart(2, '0');

  return `${day} ${month} ${year} на ${hours}:${minutes}`;
}

const navigateToEventDetails = () => {
  if (props.event?.id) {
    localStorage.setItem('eventId', props.event.id)
    console.log("Передане id івента: ", localStorage.getItem('eventId'))
    router.push({ name: 'EventDetails' })
  }
}
const getImageUrl = computed(() => {
  if (!props.event?.image) return defaultImage;
  return `https://eventio.grassbusinesslabs.uk/static/${props.event.image}`;
});
</script>


<style lang="scss" scoped>
.card-map {
  font-size: 14px;
  padding: 5px;
  margin-left: -10px;
  padding-bottom: 20px;
}
.card-date {

  margin-top: 20px;
  font-size: 16px;
  padding: 5px;
  margin-left: -10px;
  font-weight: bold;
}
.card-image {
  width: 240px;
  height: 260px;
 
  margin-right: 10px;
  margin-left: 0px;
  overflow: hidden;
}

.card-title {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 19px;
  font-weight: bold;
}

.card-body {
  margin: 0;
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 14px;
  color: #555;
}

.text-content {
  flex-grow: 1;
  padding: 10px;
  width: 520px;
}
.button-join {
  margin-top: 0px;
  width: fit-content;
  align-content: right;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .card-image {
    width: 100px;
    height: 100px;
  }

  .text-content {
    width: 100%;
    padding: 5px;
  }

  .button-join {
    font-size: 12px;
  }
}
</style>
