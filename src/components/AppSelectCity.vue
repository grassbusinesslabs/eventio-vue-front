<template>
  <div class="search-container">
    <input
      v-model="searchText"
      @input="onSearch"
      @keydown.down.prevent="navigateResults('down')"
      @keydown.up.prevent="navigateResults('up')"
      @keydown.enter="selectHighlighted"
      @blur="onBlur"
      type="text"
      :placeholder="placeholder"
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

    <ul v-if="showResults" class="search-results">
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

      <li v-if="searchResults.length && searchText">
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
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import type { CityItem } from '@/services/map'
import { useCityStore } from '@/stores/city-store'

const props = defineProps<{
  placeholder?: string
}>();

const cityStore = useCityStore()
const searchText = ref('Всі міста')
const searchResults = ref<CityItem[]>([])
const showResults = ref(false)
const highlightedIndex = ref(-1)
const searchInput = ref<HTMLInputElement | null>(null)

const searchHistory = computed(() => cityStore.searchHistory)

import { mapService } from "@/services/map"
const { searchCities } = mapService()

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

const onAddressSelect = (address: CityItem) => {
  searchText.value = address.city
  cityStore.setSelectedCity(address)
  clearResults()
}

const clearResults = () => {
  showResults.value = false
  searchResults.value = []
  highlightedIndex.value = -1
}

const onBlur = () => {
  setTimeout(clearResults, 200)
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
width: 20%;
}

.search-input {
width: 110%;
padding: 8px 10px;
border: 0px solid #ddd;
border-radius: 4px;
box-sizing: border-box;
background: transparent;
color: white;
font-size: 14px;
transition: border-color 0.3s ease;

&::placeholder {
  color: white;
  opacity: 1;
}

&:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
}

&.white-text {
  color: white;
}
}

.search-results {
position: absolute;
top: 100%;
left: 0;
right: 0;
background-color: #fff;
border: 1px solid #ddd;
border-radius: 4px;
margin: 4px 0 0;
padding: 0;
list-style: none;
max-height: 200px;
overflow-y: auto;
z-index: 1000;
width: 100%;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

&::-webkit-scrollbar {
  width: 8px;
}

&::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

&::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
  
  &:hover {
    background: #555;
  }
}
}

.search-category {
padding: 8px 10px;
font-size: 0.8em;
color: white;
background-color: #2c3e50;
font-weight: 500;
margin: 0;
border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

@keyframes fadeIn {
from {
  opacity: 0;
  transform: translateY(-10px);
}
to {
  opacity: 1;
  transform: translateY(0);
}
}

.search-results {
animation: fadeIn 0.2s ease-out;
z-index: 100;
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
transition: background-color 0.2s}
</style>