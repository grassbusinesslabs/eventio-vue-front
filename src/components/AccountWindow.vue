<template>
    <v-dialog v-model="isAccountWindowOpen" max-width="400">
      <v-card>
        <v-card-title>Account</v-card-title>
        <v-card-text>
          <!-- Add your account-related content here -->
          <Fedir />
          <Bytkor />
          <РЕДАГУВАТИ />
          <ВИЙТИ />
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  
  const isAccountWindowOpen = ref(false)
  
  function toggleAccountWindow() {
    isAccountWindowOpen.value = !isAccountWindowOpen.value
  }
  </script>