import { defineStore } from 'pinia';
import type { CityItem } from '@/services/map';

interface CityState {
  selectedCity: CityItem | null;
  searchHistory: CityItem[];
}

export const useCityStore = defineStore('city', {
  state: (): CityState => ({
    selectedCity: null,
    searchHistory: []
  }),
  getters: {
    city: (state) => state.selectedCity,
    formattedCity: (state) => {
      if (state.selectedCity) {
        return state.selectedCity.city.split(',')[0].trim(); 
      }
      return null;
    }
  },
  actions: {
    setSelectedCity(city: CityItem) {
      this.selectedCity = city;
      if (!this.searchHistory.some(item => item.city === city.city)) {
        this.searchHistory.unshift(city);
        this.searchHistory = this.searchHistory.slice(0, 5);
      }
    },
    getSelectedCity() {
      return this.selectedCity;
    },
    clearSelectedCity() {
      this.selectedCity = null;
    },

    clearHistory() {
      this.searchHistory = [];
    }
  }
})