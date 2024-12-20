<template>
    <v-layout class="rounded rounded-md">
       <app-header class="app-header"/>
 
       <v-main class="bg-grey-lighten-3">
          <v-container class="container" fill-height>
             <v-row justify="center" align="start">
                <v-col cols="12" md="10" lg="10">
                   <v-sheet 
                      min-height="80vh" 
                      max-width="110%" 
                      rounded="lg" 
                      class="pa-1 justify-center align-start"
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
 import AppHeader from '@/components/AppAuthHeader.vue'
 </script>
 
 <style lang="scss" scoped>
 .app-header {
   position: relative; 
   z-index: 10; 
   height: auto; 
   overflow: visible; 
 }
 
 </style>
 
 