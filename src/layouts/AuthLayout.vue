<template>
   <v-layout>
      <app-header />
      <div class="background-image"></div>
      <v-main class='d-flex align-center justify-center'>
         <slot />
      </v-main>
   </v-layout>
</template>

<script lang='ts' setup>
import AppHeader from '@/components/AppAuthHeader.vue'
</script>

<style lang='scss' scoped>
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/background.jpg'); // Update path
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1; // Places background behind content
}
</style>
