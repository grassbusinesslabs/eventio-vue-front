<template>
  <div class="map-container">
    <div class="map-container__map" ref="mapContainer"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { mapService } from '@/services/map'

const props = defineProps({
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  }
})

const mapContainer = ref<HTMLElement | null>(null)
const map = mapService()

onMounted(() => {
  if (mapContainer.value && props.lat && props.lon) {
    const coords = { lat: props.lat, lng: props.lon }
    
    map.createMap(mapContainer.value, {
      center: coords,
      zoom: 15
    })
    
    const marker = map.createMarker('eventMarker', coords)
    if (marker) {
      map.addMarkerToMap(marker)
    }
  }
})

onUnmounted(() => {
  map.destroyMap()
})
</script>
 
 <style scoped>
 .map-container {
   width: 100%;
   height: 400px;
 }
 
 .map-container__map {
   width: 100%;
   height: 100%;
 }
 </style>
 