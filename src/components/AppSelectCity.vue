<template>
  <div class="search-container">
    <div 
      v-if="!isEditing && !selectedCity" 
      @click="startEditing"
      class="city-label white-text"
    >
      <span>{{translate('TEXT.ALL_CITIES')}}</span>
    </div>
    <div 
      v-else-if="!isEditing && selectedCity" 
      @click="startEditing"
      class="city-label white-text"
    >
      <span>{{ selectedCity }}</span>
      <button
        @click.stop="clearSelection"
        class="clear-button"
        type="button"
      >
        ✕
      </button>
    </div>
    <div v-else class="input-wrapper">
      <input
        v-model="searchText"
        @input="onSearch"
        @keydown.down.prevent="navigateResults('down')"
        @keydown.up.prevent="navigateResults('up')"
        @keydown.enter="selectHighlighted"
        @keydown.esc="cancelEdit"
        @blur="onBlur"
        type="text"
        placeholder="Введіть місто"
        class="search-input white-text"
        ref="searchInput"
      />
      <button
        v-if="searchText"
        @click="clearInput"
        class="clear-button"
        type="button"
      >
        ✕
      </button>
    </div>

    <div v-if="showResults" class="search-results-wrapper">
      <ul class="search-results">
        <li v-if="searchHistory.length && !searchText" class="search-category">
          Recent Searches
        </li>
        <li
          v-for="(item, index) in searchHistory"
          v-if="!searchText"
          :key="'history-' + index"
          @mousedown.prevent="onAddressSelect(item)"
          class="search-item"
        >
          {{ item.city }}
          <span class="search-item-subtitle">Recent</span>
        </li>

        <li v-if="searchResults.length && searchText" class="search-category">
          Search Results
        </li>
        <li
          v-for="(item, index) in searchResults"
          :key="'result-' + index"
          @mousedown.prevent="onAddressSelect(item)"
          @mouseover="highlightedIndex = index"
          :class="['search-item', { 'highlighted': highlightedIndex === index }]"
        >
          {{ item.city }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import type { CityItem } from '@/services/map'
import { useCityStore } from '@/stores/city-store'
import { mapService } from "@/services/map"
import { useAppI18n } from '@/i18n'

const cityStore = useCityStore()
const searchText = ref('')
const searchResults = ref<CityItem[]>([])
const showResults = ref(false)
const highlightedIndex = ref(-1)
const searchInput = ref<HTMLInputElement | null>(null)
const isEditing = ref(false)
const selectedCity = ref('')
const { translate } = useAppI18n()
const searchHistory = computed(() => cityStore.searchHistory)
const { searchCities } = mapService()

onMounted(() => {
  const storedCity = cityStore.getSelectedCity()
  if (storedCity) {
    selectedCity.value = storedCity.city
  }
})

watch(
  () => cityStore.selectedCity,
  (newCity) => {
    if (newCity) {
      selectedCity.value = newCity.city
    } else {
      selectedCity.value = ''
    }
  }
)

const startEditing = () => {
  isEditing.value = true
  searchText.value = selectedCity.value
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const cancelEdit = () => {
  isEditing.value = false
  searchText.value = ''
  clearResults()
}

const clearSelection = () => {
  selectedCity.value = ''
  cityStore.clearSelectedCity()
  emit('cityChanged')
}

const onSearch = async () => {
  if (searchText.value.length >= 3) {
    try {
      searchResults.value = await searchCities(searchText.value)
      showResults.value = true
      highlightedIndex.value = -1
    } catch (error) {
      console.error("Error searching for cities:", error)
      searchResults.value = []
      showResults.value = false
    }
  } else {
    searchResults.value = []
    showResults.value = true
  }
}
const emit = defineEmits(['cityChanged'])

const onAddressSelect = (address: CityItem) => {
  selectedCity.value = address.city
  cityStore.setSelectedCity(address)
  isEditing.value = false
  clearResults()
  emit('cityChanged')
}

const clearResults = () => {
  showResults.value = false
  searchResults.value = []
  highlightedIndex.value = -1
}

const onBlur = () => {
  setTimeout(() => {
    clearResults()
    isEditing.value = false
  }, 200)
}

const navigateResults = (direction: 'up' | 'down') => {
  if (!searchResults.value.length) return
  
  if (direction === 'down') {
    highlightedIndex.value = highlightedIndex.value < searchResults.value.length - 1 
      ? highlightedIndex.value + 1 
      : 0;
  } else {
    highlightedIndex.value = highlightedIndex.value > 0 
      ? highlightedIndex.value - 1 
      : searchResults.value.length - 1
  }
}

const selectHighlighted = () => {
  if (highlightedIndex.value >= 0 && searchResults.value[highlightedIndex.value]) {
    onAddressSelect(searchResults.value[highlightedIndex.value])
  }
}

const clearInput = () => {
  searchText.value = ''
  searchResults.value = []
  showResults.value = true
  if (searchInput.value) {
    searchInput.value.focus()
  }
}
</script>

<style lang="scss" scoped>
.search-container {
  position: relative;
  width: 100%;
  min-width: 200px;
}

.city-label {
  cursor: pointer;
  padding: 8px 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 8px 10px;
  border: 0px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  background: transparent;
  color: white;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    opacity: 1;
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }
}

.search-results-wrapper {
  position: fixed;
  top: 64px;
  left: auto;
  min-width: 200px;
  z-index: 1001;
}

.search-results {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
  width: 100%;
}

.search-category {
  padding: 8px 10px;
  font-size: 0.8em;
  color: #333;
  background-color: #f5f5f5;
  font-weight: 500;
  margin: 0;
  border-bottom: 1px solid #eee;
}

.search-item {
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f5f5f5;
  }

  &.highlighted {
    background-color: #e3f2fd;
    color: #B55C65FF;
  }
}

.search-item-subtitle {
  float: right;
  font-size: 0.8em;
  color: #666;
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  margin-left: 8px;
}

.clear-button {
  position: absolute;
  right: -25px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

@media (max-width: 768px) {
  .search-container {
    width: 100%;
  }

  .search-input {
    font-size: 16px; 
    padding: 12px 10px;
  }

  .search-item {
    padding: 12px 10px;
  }

  .search-results-wrapper {
    width: 100%;
    left: 0;
  }
}
</style>