<template>
  <v-col cols="12">
    <v-card class="d-flex align-center">
      <v-img
        src="https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg?auto=format%2Ccompress&fit=max&w=3840"
        alt="Image"
        class="card-image"
        aspect-ratio="1"
        cover
      ></v-img>

      <v-card-text class="text-content">
        

        <h3 class="card-title" v-if="event?.title">{{ event.title }}</h3>

        <p class="card-body">
          <span v-if="!isExpanded">{{ truncatedBody }}</span>
          <span v-else>{{ event?.description }}</span>
        </p>

        <p class="card-map" v-if="event?.location">
          <v-icon left>mdi-map-marker</v-icon>
          {{ event.location }}
        </p>
        <v-divider></v-divider>
        <p class="card-members-number">Кількість учасників: 0</p>
        <v-row class="d-flex align-end ma-1">
        <p class="card-date" v-if="event?.date">
          {{ formatDate(event.date) }}
        </p>
        <v-btn
          class="button-join ml-auto"
        >{{ translate("BTNS.DELETEEV") }}</v-btn>
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
import { uk } from 'date-fns/locale'
import { format, getMonth, getYear, getDate, getHours, getMinutes } from 'date-fns'

const { translate } = useAppI18n()

const isExpanded = ref(false)

const props = defineProps<{
  event: Event | null
}>()

const event = props.event

const truncatedBody = computed(() => {
  const maxLength = 155;
  return event?.description && event.description.length > maxLength
    ? event.description.slice(0, maxLength) + "..."
    : event?.description || ""
})

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

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
};
</script>

<style lang="scss" scoped>
.card-map {
  font-size: 14px;
  padding: 5px;
  margin-left: -10px;
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
  height: 240px;
 
  margin-right: 10px;
  margin-left: 10px;
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
</style>
