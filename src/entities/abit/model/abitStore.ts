import { defineStore } from 'pinia'

export const useAbitStore = defineStore('abitModule', {
  state: () => ({
    selectedAbit: null,
    years: [],
    selectedYear: null,
    selectedName: null,
  }),
  getters: {
    getSelectedAbit: (state) => state.selectedAbit,
    getSelectedYear: (state) => state.selectedYear,
    getSelectedName: (state) => state.selectedName,
    getYears: (state) => state.years,
  },
  actions: {
    selectAbit(id) {
      this.selectedAbit = id
    },
    selectYear(year) {
      this.selectedYear = year
    },
    selectName(name) {
      this.selectedName = name
    },
    setYears(years) {
      this.years = Array.isArray(years) ? years : []
    },
  },
})
