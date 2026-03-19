export const initialFiltersState = {
  type: [],
  dateStart: null,
  dateEnd: null,
  branch: [],
  academicYear: null,
  levels: [],
  status: [],
  showValues: null,
};

export function createFiltersStore() {
  let filters = { ...initialFiltersState };

  return {
    get() {
      return { ...filters };
    },
    set(newFilters) {
      filters = { ...filters, ...newFilters };
    },
    reset() {
      filters = { ...initialFiltersState };
    }
  };
}