<template>
   <v-layout class="rounded rounded-md">
      <app-header class="app-header"/>

      <v-main class="bg-grey-lighten-3">
         <v-container class="container" fill-height>
            <v-row justify="center" align="center">
               <v-col cols="12" md="10" lg="10">
                  <v-sheet 
                     min-height="80vh" 
                     max-width="100%" 
                     rounded="lg" 
                     class="d-flex flex-column justify-center align-center"
                  >
                     <slot />
                  </v-sheet>
               </v-col>
            </v-row>
         </v-container>
      </v-main>
   </v-layout>
</template>

<script lang="ts" setup>
import AppHeader from '@/components/AppHeader.vue'
</script>

<style lang="scss" scoped>
.app-header {
  position: relative; /* або інше, якщо потрібно */
  z-index: 10; /* Залишає header зверху, але не блокує випадаючий список */
  height: auto; /* Переконайтеся, що висота адаптивна */
  overflow: visible; /* Дозволяє випадаючим спискам виходити за межі header */
}
</style>

