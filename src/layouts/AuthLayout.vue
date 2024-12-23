<template>
   <v-layout>
      <app-header />

      <v-main class='d-flex align-center justify-center'>
         <slot />
      </v-main>
   </v-layout>
</template>

<script lang='ts' setup>
import AppHeader from '@/components/AppAuthHeader.vue'
</script>

<style lang='scss' scoped>

</style>
