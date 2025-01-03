<template>
  <v-app-bar color="#753737FF" dark class="app-bar">
    <v-app-bar-title>Event Management</v-app-bar-title>
    <v-icon left class="location-icon">mdi-map-marker</v-icon>
    <div class="search-wrapper">
      <app-select-city @city-changed="() => emit('cityChanged')" />
    </div>
    <v-spacer />
    
    <template v-slot:append>
      <v-btn
        class="filter-button ml-4"
        variant="outlined"
        style="border-color: #ccc;"
        @click="toggleFilterDrawer"
      >
        <v-icon color="#FFFFFF" size="x-large">mdi-filter-multiple</v-icon>
      </v-btn>
      
      <v-btn
        class="account-button ml-4"
        variant="outlined"
        style="border-color: #ccc;"
        @click="toggleDrawer"
      >
      <v-avatar size="56px">
        <img
           :src="getImageUrl"
           @error="onImageError"
          alt="User Avatar"
        />
      </v-avatar>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import AppSelectCity from "@/components/AppSelectCity.vue"
import { useUserStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed } from "vue"

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq8T0hZUoX8kuRi3EZpZbUDtZ_WqqN9Ll15Q&s"
  
const props = defineProps<{
  drawer: boolean,
  filterDrawer: boolean
}>()

const emit = defineEmits<{
  'update:drawer': [value: boolean]
  'update:filterDrawer': [value: boolean]
  'cityChanged': [] 
}>()

const toggleDrawer = () => {
  emit('update:drawer', !props.drawer)
}

const toggleFilterDrawer = () => {
  emit('update:filterDrawer', !props.filterDrawer)
}
const getImageUrl = computed(() => {
  return `https://eventio.grassbusinesslabs.uk/static/user_image/${currentUser.value?.id}.png`;
})
const onImageError = (event: Event) => {
  (event.target as HTMLImageElement).src = defaultImage
}
</script>

<style lang="scss" scoped>
.app-bar {
  border-radius: 0;
  position: fixed;
  z-index: 100;
}

.main-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.location-icon {
  margin-left: 18%;
}

.search-wrapper {
  margin-left: 20px;
  min-width: 200px;
  z-index: 1001;
}

.account-button {
  border-radius: 50%;
  height: 60px;
  width: 60px;
  align-content: center;
  padding: 0;
  border: 0;
  z-index: 100;
  margin-left: 16px;
  
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

.filter-button {
  border-radius: 50%;
  height: 60px;
  width: 30px;
  align-content: center;
  padding: 0;
  border: 0;
  z-index: 100;
}

:deep(.v-toolbar__content) {
  z-index: auto;
}

@media screen and (max-width: 768px) {
  .title {
    font-size: 1.25rem;
    white-space: nowrap;
  }

  .main-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .location-icon {
    margin-left: 0;
    margin-bottom: 8px;
  }

  .search-wrapper {
    margin-left: 0;
    width: 100%;
    min-width: 100px;
  }

  .account-button,
  .filter-button {
    height: 48px;
    width: 48px;
  }

  .account-button {
    margin-left: 8px;
  }

  :deep(.v-avatar) {
    height: 44px !important;
    width: 44px !important;
  }
}

@media screen and (max-width: 480px) {
  .title {
    font-size: 1.1rem;
  }

  .account-button,
  .filter-button {
    height: 40px;
    width: 40px;
  }

  :deep(.v-avatar) {
    height: 36px !important;
    width: 36px !important;
  }
}
</style>