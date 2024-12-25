<template>
   <v-layout >
     <app-header class="app-header"/>
     
     <v-main class="bg-grey-lighten-3">
       <v-container class="back-button-container">
         <v-row justify="start">
           <v-col cols="auto">
             <v-btn
               variant="text"
               @click="router.push('/')"
               class="back-button"
               prepend-icon="mdi-arrow-left"
             >
               {{ translate('BTNS.RETURN') }}
             </v-btn>
           </v-col>
         </v-row>
       </v-container>
 
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
 import { useRouter } from 'vue-router'
 import AppHeader from '@/components/AppAuthHeader.vue'
import { useAppI18n } from '@/i18n';
 
 const { translate } = useAppI18n()
 const router = useRouter()
 </script>
 
 <style lang="scss" scoped>
 .app-header {
   position: relative;
   z-index: 10;
   height: auto;
   overflow: visible;
 }
 
 .container {
   width: 950px;
 }
 
 .back-button-container {
   width: 950px;
   padding-bottom: 0;
 }
 
 .back-button {
   margin-left: 70px;
 }
 </style>