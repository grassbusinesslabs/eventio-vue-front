<template>
    <v-app-bar color="#753737FF" dark>
      <v-app-bar-title>Event Management</v-app-bar-title>
  
      <!-- Меню навігації -->
      <v-spacer />
      <v-btn class="mr-4" text to="/events">{{translate("BTNS.OVERVIEW")}}</v-btn>
      <v-btn class="mr-4" text to="/myEvents">{{translate("BTNS.MY_EVENTS")}}</v-btn>
      <!-- Мова -->
      <template v-slot:append>
        <app-select-lang />
      </template>
    </v-app-bar>
  </template>
  
  <script lang="ts" setup>
  import AppSelectLang from "@/components/AppSelectLang.vue";
  import {useAppI18n} from '@/i18n'

  const {translate} = useAppI18n()
  </script>
  
  <style lang="scss" scoped>
  </style>