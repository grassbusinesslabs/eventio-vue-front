<template>
  <profile-layout>
    <v-row class="ma-0">
      <template v-if="events.length">
        <app-post
          v-for="event in events"
          :key="event.id"
          :event="event"
          @subs-canceled="loadEvents"
        />
      </template>
      <template v-else>
        <v-col cols="12" class="text-center py-6">
          <v-icon size="48" color="grey lighten-1">mdi-calendar-remove</v-icon>
          <p class="mt-4 text-h6 grey--text">{{ translate('TEXT.NOT-PARTICIPANT') }}</p>
        </v-col>
      </template>
    </v-row>

    <v-row justify="center" class="mt-4">
      <v-pagination
        class="pagination"
        v-if="totalPages > 1"
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @update:model-value="handlePageChange"
      ></v-pagination>
    </v-row>
  </profile-layout>
</template>
  
<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import type { Event } from '@/models'
import { requestService } from '@/services'
import { useHandleError } from '@/composables'
import { useUserStore } from '@/stores'
import ProfileLayout from '@/layouts/ProfileLayout.vue'
import AppPost from '@/components/AppSubs.vue'
import { useAppI18n } from '@/i18n'
  
const { handleError } = useHandleError()
const userStore = useUserStore()
const request = requestService()
const { translate } = useAppI18n()
const events = ref<Event[]>([])
const loadingEvents = ref<boolean>(false)
const currentPage = ref<number>(1)
const totalPages = ref<number>(1)
const totalItems = ref<number>(0)
  
const handlePageChange = (page: number): void => {
    currentPage.value = page
    localStorage.setItem('currentPage', page.toString())
    loadEvents()
}
  
async function loadEvents(): Promise<void> {
  try {
      loadingEvents.value = true
      const response = await request.getMySubs(currentPage.value)
      
      events.value = response?.events || []
      totalPages.value = response.pages || 1
      totalItems.value = response.total || 0
  
    } catch (error) {
      console.error('Error loading subscribed events:', error)
      handleError(error)
      events.value = []
      totalPages.value = 1
      totalItems.value = 0
    } finally {
      loadingEvents.value = false
  }
}
  
onMounted(() => {
  userStore.populate()
  loadEvents()
})
</script>
  
<style lang='scss' scoped>
  
.pagination {
  margin-bottom: 15px;
}
</style>