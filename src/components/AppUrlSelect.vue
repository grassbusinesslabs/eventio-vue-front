<template>
    <v-select
      v-model="selectedUrl"
      :items="apiUrls"
      item-title="title"
      item-value="value"
      variant="underlined"
      density="compact"
      class="url-select"
      @update:model-value="handleUrlChange"
    />
  </template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { apiService } from '@/services/api'
  
  const { apiUrls, currentApiUrl, setApiUrl } = apiService()
  
  const selectedUrl = ref(currentApiUrl.value)
  
  const handleUrlChange = (url: string) => {
    setApiUrl(url)
  }
  </script>
  
  <style lang="scss" scoped>
  .url-select {
    width: 140px;
    margin-right: 16px;
  }
  </style>