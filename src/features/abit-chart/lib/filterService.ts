export function filterData(data, filters) {
  return data.filter(item => {
    
    if (filters.type) {
      if (item.type !== filters.type) {
        return false;
      }
    }

    
    if (filters.dateStart) {
      const startDate = new Date(filters.dateStart);
      const itemDate = new Date(item.date);
      if (itemDate < startDate) {
        return false;
      }
    }

    
    if (filters.dateEnd) {
      const endDate = new Date(filters.dateEnd);
      const itemDate = new Date(item.date);
      if (itemDate > endDate) {
        return false;
      }
    }

    
    if (filters.branch && filters.branch.length > 0) {
      if (!filters.branch.includes(item.branch)) {
        return false;
      }
    }

    
    if (filters.academicYear) {
      if (item.academicYear !== filters.academicYear) {
        return false;
      }
    }

    
    if (filters.levels && filters.levels.length > 0) {
      if (!filters.levels.includes(item.level)) {
        return false;
      }
    }

    
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(item.status)) {
        return false;
      }
    }

    return true;
  });
}