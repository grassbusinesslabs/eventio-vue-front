<template>
  <home-layout>
    <div class="content-section">
      <v-row align="center" class="mb-6">
        <v-col>
          <h2 class="text-h5">
            {{ events.length }} {{ translate("TEXT.EVENTS") }}
          </h2>
        </v-col>
        <v-col cols="auto">
          <v-btn
            class="ml-auto"
            @click="navigateToAdd"
            size="large"
            prepend-icon="mdi-plus-circle"
          >
            {{ translate("BTNS.ADD_EVENT") }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <template v-if="events.length">
        <app-post v-for="event in events" :key="event.id" :event="event" @event-deleted="loadEvents"/>
        </template>
        <template v-else>
        <v-col cols="12" class="text-center py-6">
          <v-icon size="48" color="grey lighten-1">mdi-calendar-remove</v-icon>
          <div class="text-h6 text-grey-darken-1">
          <p class="mt-4 text-h6 grey--text">{{ translate('TEXT.NO-EVENTS') }}</p>
          </div>
          <div class="text-body-1 text-grey-darken-1">
            {{ translate("TEXT.CLICK-ADD") }}
          </div>
        </v-col>
      </template>
      </v-row>
      <v-row justify="center" class="mt-4">
        <v-pagination
          v-if="totalPages > 1"
          v-model="currentMyPage"
          :length="totalPages"
          :total-visible="7"
          @update:model-value="handlePageChange"
        ></v-pagination>
      </v-row>
    </div>
  </home-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Event, GetEventsResponse } from '@/models'
import { requestService } from '@/services'
import { useHandleError } from '@/composables'
import { useAppI18n } from '@/i18n'
import { useUserStore } from '@/stores'
import HomeLayout from '@/layouts/ProfileLayout.vue'
import AppPost from '@/components/AppMyPost.vue'
import router from '@/router'

const request = requestService()
const { handleError } = useHandleError()
const { translate } = useAppI18n()
const userStore = useUserStore()

const events = ref<Event[]>([])
const loadingEvents = ref(false)

const currentMyPage = ref<number>(1)
const totalPages = ref<number>(1)
const totalItems = ref<number>(0)

const handlePageChange = (page: number): void => {
  currentMyPage.value = page
  loadEvents()
}

async function loadEvents(): Promise<void> {
  try {
    loadingEvents.value = true
    
    const params = {
      user: "true",
      page: currentMyPage.value
    }
    
    const response: GetEventsResponse = await request.findEvents(params)
    events.value = response?.events || []
    totalPages.value = response?.pages || 1
    totalItems.value = response?.total || 0
  } catch (error) {
    console.error(error)
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
const navigateToAdd = () => {
    localStorage.setItem('eventId', "")
    localStorage.setItem('currentMyPage', currentMyPage.value.toString())
    router.push({ name: 'AddEvent' })
}
</script>

<style lang="scss" scoped>
.content-section {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px;
}
</style>