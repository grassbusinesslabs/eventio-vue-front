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
         <!--Мені потрібно це змінити при підключенні до api-->
         <p class="card-date">
            <v-icon left>mdi-calendar</v-icon>
            12 Грудня 2024
         </p>
         <p class="card-date">
            <v-icon left>mdi-map-marker</v-icon>
            ОМЦ, вул. Міщенка 2, 3-й поверх, Полтава
         </p>

         <h3 class="card-title">{{ post.title }}</h3>

         <p class="card-body">
          <span v-if="!isExpanded">{{ truncatedBody }}</span>
          <span v-else>{{ post.body }}</span>
        </p>

        <v-btn variant="plain"
               @click="toggleExpand" 
               text
               >
          {{ isExpanded ? 'Згорнути' : 'Детальніше' }}
        </v-btn>
        <v-divider></v-divider>
        <v-btn class="button-join ml-auto"
               prepend-icon="mdi-check">Доєднатися</v-btn>
       </v-card-text>
     </v-card>
   </v-col>
 </template>
<script lang='ts' setup>
import {defineProps} from 'vue'

import { ref, computed } from 'vue';

import type {Post} from '@/models'

const isExpanded = ref(false)

const props = defineProps<{
  post: Post
}>()

const post = props.post

const truncatedBody = computed(() => {
  const maxLength = 200;
  return post.body.length > maxLength ? post.body.slice(0, maxLength) + '...' : post.body;
})


const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
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
  flex-grow: 1; /* Текст займає весь доступний простір */
  padding: 10px; /* Видаляємо внутрішні відступи */
}
.button-join {
   margin-top: 15px;
  width:fit-content; /* Задає ширину кнопки 100%, щоб вона займала всю доступну ширину контейнера */
  align-content: right; /* Вирівнює текст кнопки вправо */
  display: flex;
  justify-content: flex-end; /* Вирівнює кнопку вправо всередині контейнера */
}
</style>
