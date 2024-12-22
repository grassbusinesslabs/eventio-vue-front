<template>
  <v-app-bar color="#753737FF" dark class="app-bar">
    <v-app-bar-title>Event Management</v-app-bar-title>
    <v-icon left>mdi-map-marker</v-icon>
    <div class="search-wrapper">
      <app-select-city/>
    </div>
    <v-spacer />
    
    <template v-slot:append>
      <app-select-lang />
      
      <v-btn
        class="account-button ml-4"
        variant="outlined"
        style="border-color: #ccc;"
        @click="toggleDrawer"
      >
        <v-icon style="font-size: 55px;" class="account-icon">
          mdi-account-circle
        </v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import AppSelectLang from "@/components/AppSelectLang.vue"
import AppSelectCity from "@/components/AppSelectCity.vue"

const props = defineProps<{
  drawer: boolean
}>()

const emit = defineEmits<{
  'update:drawer': [value: boolean]
}>()

const toggleDrawer = () => {
  emit('update:drawer', !props.drawer)
}
</script>

<style lang="scss" scoped>
.app-bar {
  border-radius: 0%;
  position: relative;
  z-index: 100;
}

.search-wrapper {
  position: relative;
  z-index: 1001;
  min-width: 200px;
}

.account-button {
  border-radius: 50%;
  height: 90px;
  width: 60px;
  align-content: center;
  padding: 0;
  border: 0px;
  z-index: 100;
}

:deep(.v-toolbar__content) {
  z-index: auto;
}
</style>