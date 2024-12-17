<template>
   <v-col cols='12'>
      <app-map />
   </v-col>

   <v-col cols='12'>
      <app-address-autocomplete @select='selectAddress' />
   </v-col>
</template>

<script lang='ts' setup>
import {LngLatLike, Marker} from '@tomtom-international/web-sdk-maps'

import {AddressItem, mapService} from '@/services/map'
import AppMap from '@/components/AppMap.vue'
import AppAddressAutocomplete from '@/components/AppAddressAutocomplete.vue'

const map = mapService()

const mapZoom: number = 15
const duration: number = 500

async function selectAddress(address: AddressItem): Promise<void> {
   console.log(address)

   map.removeAllMarkers()

   const marker: Marker | null = map.createMarker(address.details.id, address.details.position as LngLatLike)

   if (marker) {
      map.addMarkerToMap(marker)
   }

   map.setMapCenter(address.details.position as LngLatLike, {duration})

   if (mapZoom !== map.getMapZoom()) {
      await new Promise(resolve => setTimeout(resolve, duration))
      map.setZoom(15, {duration})
   }
}
</script>

<style lang='scss' scoped>

</style>
