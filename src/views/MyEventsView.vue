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
            to="/addEvent"
            size="large"
            prepend-icon="mdi-plus-circle"
          >
            {{ translate("BTNS.ADD_EVENT") }}
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <app-post v-for="event in events" :key="event.id" :event="event" />
      </v-row>
    </div>
  </home-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import type { Event } from '@/models'
import { requestService } from '@/services'
import { useHandleError } from '@/composables'
import { useAppI18n } from '@/i18n'
import { useUserStore } from '@/stores'
import HomeLayout from '@/layouts/ProfileLayout.vue'
import AppPost from '@/components/AppMyPost.vue'

const request = requestService()
const { handleError } = useHandleError()
const { translate } = useAppI18n()
const userStore = useUserStore()

const events = ref<Event[]>([])
const loadingEvents = ref(false)

async function loadEvents(): Promise<void> {
  try {
    loadingEvents.value = true
    const response = await request.getMyEvents()
    events.value = response.events || []
  } catch (error) {
    console.error(error)
    handleError(error)
    events.value = []
  } finally {
    loadingEvents.value = false
  }
}

onMounted(() => {
  userStore.populate()
  loadEvents()
})
</script>

<style lang="scss" scoped>
.content-section {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px;
}
</style>