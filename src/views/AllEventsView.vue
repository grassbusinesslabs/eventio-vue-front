<template>
  <home-layout @city-changed="loadEvents">
    <template #filter-content>
      <v-list>
        <v-list-item class="justify-center pa-4">
          <v-list-item-title class="filter-title text-center">
            Фільтрування івентів
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list class="pa-4">
        <v-list-item>
          <v-list-item-title class="filter-subtitle mb-2">За конкретною датою</v-list-item-title>
          <input 
            type="date"
            v-model="filterDay"
            class="filter-input mb-4"
            @update:model-value="handleDayChange"
          />
        </v-list-item>

        <v-list-item>
          <v-list-item-title class="filter-subtitle mb-2">За місяцем та роком</v-list-item-title>
          <input 
            type="month"
            v-model="filterMonth"
            class="filter-input mb-4"
            @update:model-value="handleMonthChange"
          />
        </v-list-item>

        <v-list-item>
          <v-list-item-title class="filter-subtitle mb-2">За роком</v-list-item-title>
          <v-select
            v-model="filterYear"
            :items="yearOptions"
            class="filter-year-input"
            density="comfortable"
            variant="outlined"
            @update:model-value="handleYearChange"
          />
        </v-list-item>

        <v-list-item v-if="isClearButtonVisible">
          <v-btn
            block
            color="error"
            class="mt-4"
            @click="clearInput"
          >
            Очистити фільтри
            <v-icon right>mdi-close-circle</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </template>
      <v-sheet class='mx-auto'>
      <v-row class='ma-0'>
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
          <v-btn class="bookmark-button" 
                variant="outlined"
                height="50px"
                width="90px">
            <v-icon color="#3E3B3BFF" size="x-large">mdi-bookmark</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>

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
import { onMounted, ref, computed, watch } from 'vue'
import type { Event} from '@/models'
import { requestService } from '@/services'
import { useHandleError } from '@/composables'
import { useAppI18n } from '@/i18n'
import { useUserStore } from '@/stores'
import HomeLayout from '@/layouts/HomeLayout.vue'
import AppPost from '@/components/AppPost.vue'
import { useCityStore } from '@/stores/city-store'
import EventPageView from '@/components/EventPageView.vue'

const cityStore = useCityStore()

const { handleError } = useHandleError()
const { translate } = useAppI18n()
const userStore = useUserStore()
const selectedCity = cityStore.formattedCity

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
      city: selectedCity || undefined,
      day: filterDay.value ? getUnixTimestamp(filterDay.value) : undefined,
      month: filterMonth.value ? getUnixTimestamp(filterMonth.value) : undefined,
      year: filterYear.value ? getUnixTimestamp(`${filterYear.value}-01-01`) : undefined,
      search: searchQuery.value || undefined, 
      location: undefined
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
  userStore.populate();
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
})

watch(
  () => cityStore.formattedCity, 
  () => {
    loadEvents() 
  }
)

</script>

<style lang='scss' scoped>
.search-input {
  padding: 0px 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width:823px;
  height: 50px;

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
.filter-button {
  height: 50px;
  width: 55px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filter-drawer {
  .filter-title {
    font-size: 22px;
    color: #753737;
  }

  .filter-subtitle {
    font-size: 16px;
    color: #666;
  }

  .filter-input {
    width: 100%;
    height: 50px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      border-color: #753737;
      outline: none;
    }
  }
  .filter-year-input {
    width: 100%;
    height: 60px;
    padding: 0px;
    border: 1px solid #ffffff;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      border-color: #753737;
      outline: none;
    }
  }
}
</style>