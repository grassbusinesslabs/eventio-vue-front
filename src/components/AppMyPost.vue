<template>
   <v-col cols="12">
     <v-card class="d-flex align-center">
      <!--Мені потрібно це змінити при підключенні до api-->
       <v-img
         src="https://marketing-cdn.tickettailor.com/ZgP1j7LRO5ile62O_HowdoyouhostasmallcommunityeventA10-stepguide%2CMiniflagsattheevent.jpg?auto=format%2Ccompress&fit=max&w=3840"
         alt="Image"
         class="card-image"
         aspect-ratio="1"
         cover
       ></v-img>

       <v-card-text class="text-content">
        <p class="card-date" v-if="event?.date">
          <v-icon left>mdi-calendar</v-icon>
          {{ formatDate(event.date) }}
        </p>
        <p class="card-date" v-if="event?.location">
          <v-icon left>mdi-map-marker</v-icon>
          {{ event.location }}
        </p>

         <h3 class="card-title" v-if="event?.title">{{ event.title }}</h3>

         <p class="card-body">
          <span v-if="!isExpanded">{{ truncatedBody }}</span>
          <span v-else>{{ event?.description }}</span>
        </p>

        <v-btn variant="plain"
               @click="toggleExpand" 
               text
               >
          {{ isExpanded ? 'Згорнути' : 'Детальніше' }}
        </v-btn>
        <v-divider></v-divider>
        <p class="card-members-number">Кількість учасників: 0</p>
       </v-card-text>
     </v-card>
   </v-col>
 </template>
<script lang='ts' setup>
import {defineProps} from 'vue'

import { ref, computed } from 'vue';
import { format } from 'date-fns'
import type { Event } from "@/models"

const isExpanded = ref(false)

const props = defineProps<{
  event: Event | null
}>()

const event = props.event

const truncatedBody = computed(() => {
  const maxLength = 200;
  return event?.description && event.description.length > maxLength
    ? event.description.slice(0, maxLength) + "..."
    : event?.description || ""
})


const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
}

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return format(date, 'dd.MM.yyyy HH:mm');
}
</script>

<style lang='scss' scoped>
.card-date {
   margin-left: 20px;
   font-size: 14px;
   padding: 5px;
}
.card-image {
  width: 240px;
  height: 240px;
  border-radius: 4px;
  margin-right: 10px;
  margin-left: 10px;
  overflow: hidden;
}

.card-title {
   margin-top: 15px;
   margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
}

.card-body {
  margin: 0;
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 14px;
  color: #555;
  //padding: 10px;
}

.text-content {
  flex-grow: 1;
  padding: 10px; 
  width: 510px;
}
.button-join {
   margin-top: 15px;
  width:fit-content; 
  align-content: right;
  display: flex;
  justify-content: flex-end;
}
.card-members-number{
  margin-top: 15px;
}
</style>
