<template>
  <home-layout>
    <v-sheet class='mx-auto'>
      <v-row class='ma-0'>
      </v-row>
    </v-sheet>
    
    <v-row class="d-flex align-center ma-0">
      <v-col cols="auto" class="d-flex align-center">
        <v-text-field  
          :placeholder="translate('INPUTS.SEARCH')"
          v-model="searchQuery"
          variant="plain"
          class="search-input"
          density="comfortable"
          clearable
          @update:model-value="debouncedSearch">
          <v-icon left>mdi-magnify</v-icon>
        </v-text-field>
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
      <button class="bookmark-button">
        <v-icon color="#3E3B3BFF">mdi-bookmark</v-icon>
      </button>
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
        <input type="date"
          v-model="filterDay"
          class="day-input"
          density="compact"
          width="10px"
          clearable
          @update:model-value="handleDayChange"
        />
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
        <input type="month"
          v-model="filterMonth"
          class="month-input"
          label="Місяць"
          density="compact"
          clearable
          @update:model-value="handleMonthChange"
        />
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
        <v-select
          v-model="filterYear"
          :items="yearOptions"
          class="year-input"
          label="Рік"
          density="compact"
           variant="outlined"
           base-color="#FFFFFFFF"
           item-color="#ccc"
          @update:model-value="handleYearChange"
        />
      </v-col>
      
        <button
         v-if="isClearButtonVisible"
        @click="clearInput"
        class="clear-button"
        type="button"
      >
      <v-icon color="#3E3B3BFF">mdi-close-circle</v-icon>
      </button>
 
    </v-row>

    <v-row class='ma-0'>
      <app-post
        v-for='event in events'
        :key='event.id'
        :event='event'
      />
    </v-row>
  </home-layout>
</template>

<script lang='ts' setup>
import { onMounted, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

import type { Event, GetEventsResponse } from '@/models'
import { requestService } from '@/services'
import { useHandleError } from '@/composables'
import { useAppI18n } from '@/i18n'
import { useUserStore } from '@/stores'
import HomeLayout from '@/layouts/HomeLayout.vue'
import AppPost from '@/components/AppPost.vue'

const { handleError } = useHandleError()
const { translate } = useAppI18n()
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

const request = requestService()

const events = ref<Event[]>([])
const loadingEvents = ref<boolean>(false)
const searchQuery = ref<string>('')
const filterDay = ref<string>('')
const filterMonth = ref<string>('')
const filterYear = ref<number | null>(null)

const yearOptions = [2024, 2025, 2026]

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const handleDayChange = () => {
  filterMonth.value = ''
  filterYear.value = null
  loadEvents()
}

const handleMonthChange = () => {
  filterDay.value = ''
  filterYear.value = null
  loadEvents()
}

const handleYearChange = () => {
  filterDay.value = ''
  filterMonth.value = ''
  loadEvents()
}

const getUnixTimestamp = (date: string): number | undefined => {
  if (!date) return undefined
  return Math.floor(new Date(date).getTime() / 1000)
}

async function loadEvents(): Promise<void> {
  try {
    loadingEvents.value = true

    const params = {
      day: filterDay.value ? getUnixTimestamp(filterDay.value) : undefined,
      month: filterMonth.value ? getUnixTimestamp(filterMonth.value) : undefined,
      year: filterYear.value ? getUnixTimestamp(`${filterYear.value}-01-01`) : undefined,
      title: searchQuery.value || undefined
    }

    const response = await request.findEvents(params)
    events.value = response.events || []

  } catch (error) {
    console.error('Error loading events:', error)
    handleError(error)
    events.value = []
  } finally {
    loadingEvents.value = false
  }
}

const debouncedSearch = debounce(() => {
  loadEvents()
}, 300)

onMounted(() => {
  loadEvents()
})

const clearInput = () => {
  filterDay.value = ''
  filterMonth.value = ''
  filterYear.value = null
  loadEvents()
}
const isClearButtonVisible = computed(() => {
  return filterDay.value || filterMonth.value || filterYear.value || searchQuery.value;
});
</script>

<style lang='scss' scoped>
.search-input {
  padding: 0px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 380px;
  height: 50px;
  margin-left: 0px;

}
.bookmark-button{
  border: 1px solid #ccc;
  height: 50px;
  width: 55px;
  border-radius: 4px;
}
.month-input {
  padding: 5px 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 50px;
  width: 145px;
  margin-left: -20px;
  color: #ccc;
}

.day-input {
  padding: 5px 5px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 50px;
  width: 115px;
  margin-left: 0px;
  color: #ccc;
}

.year-input {
  padding: 5px 5px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 50px;
  width: 145px;
  margin-left: -20px;
}
.clear-button{
  width: 25px;
}
</style>