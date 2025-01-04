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
     if (marker && map) {
  map.addMarkerToMap(marker)
} else {
  console.error('Failed to add marker to map. Marker or map is missing.');
}
    } else {
      console.error('Marker creation failed');
    }
  } else {
    console.error('Map container or coordinates are missing');
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


:deep(.marker-icon) {
  width: 44px; 
  height: 44px; 
}

:deep(.map-marker) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px; 
  height: 24px; 
  cursor: pointer;
  transform: translate(-50%, -50%); 
}
</style>

 