import api from "@/shared/api/http";
import { BASE_URL, endpoints } from "@/entities/abit/api/config";
import type {
  EndpointRequestByAlias,
  EndpointResponseByAlias,
} from "@/entities/abit/api/config";

type ChartBuildRequest = EndpointRequestByAlias<"GET_ApplicantsChart">["body"];
type ChartBuildResponse = EndpointResponseByAlias<"GET_ApplicantsChart">;

interface ChartBuildUiRequest {
  typeCnn: number;
  startDate: string;
  endDate: string;
  years: number[];
  pk: string[];
  levels: string[];
  states: string[];
}

function toChartBuildPayload(data: Record<string, any>): ChartBuildRequest {
  return {
    TypeCnn: Number(data.typeCnn ?? 0),
    StartDate: String(data.startDate ?? ""),
    EndDate: String(data.endDate ?? ""),
    Years: Array.isArray(data.years) ? data.years.map(Number) : [],
    PK: Array.isArray(data.pk) ? data.pk : [],
    Levels: Array.isArray(data.levels) ? data.levels : [],
    States: Array.isArray(data.states) ? data.states : [],
  };
}

export const chartApiService = {
  async getAllChartData(bd: string | null, year: number) {
    try {
      const startDate = `${year}-01-01T00:00:00.000Z`;
      const endDate = `${year}-12-31T23:59:59.999Z`;
      const year_ = new Date(startDate).getFullYear();
      const requestData: ChartBuildUiRequest = {
        typeCnn: 0,
        startDate: startDate,
        endDate: endDate,
        years: [year_],
        pk: [],
        levels: [],
        states: [],
      };
      const url = new URL(BASE_URL + endpoints.GET_ApplicantsChart);
      if (bd) {
        url.searchParams.append("db", bd);
      }

      const response = await api.post<ChartBuildResponse, ChartBuildRequest>(
        url.toString(),
        toChartBuildPayload(requestData),
      );
      const formattedData = this.formatDateField(response?.data ?? []);
      return formattedData;
    } catch (error) {
      console.error("Error fetching chart data:", error);
      return this.formatDateField([]);
    }
  },

  async getFilteredChartData(
    filters: Record<string, any>,
    db: string | null,
    year: number,
  ) {
    try {
      const transformedFilters = this.transformFilters(filters);

      const currentYear = new Date().getFullYear();
      const baseRequest: ChartBuildUiRequest = {
        typeCnn: 0,
        startDate: `${year}-01-01T00:00:00.000Z`,
        endDate: `${year}-12-31T23:59:59.999Z`,
        years: [year],
        pk: [],
        levels: [],
        states: [],
      };

      const requestData = { ...baseRequest };

      if (transformedFilters.startDate !== undefined) {
        requestData.startDate = transformedFilters.startDate;
      }
      if (transformedFilters.endDate !== undefined) {
        requestData.endDate = transformedFilters.endDate;
      }

      Object.keys(transformedFilters).forEach((key) => {
        if (key !== "startDate" && key !== "endDate") {
          if (
            transformedFilters[key] !== undefined &&
            transformedFilters[key] !== null
          ) {
            if (Array.isArray(transformedFilters[key])) {
              if (transformedFilters[key].length > 0) {
                requestData[key] = transformedFilters[key];
              }
            } else {
              requestData[key] = transformedFilters[key];
            }
          }
        }
      });

      const year_ = new Date(requestData.startDate).getFullYear();
      requestData.years = [year_];

      const url = new URL(BASE_URL + endpoints.GET_ApplicantsChart);
      if (db) {
        url.searchParams.append("db", db);
      }

      const response = await api.post<ChartBuildResponse, ChartBuildRequest>(
        url.toString(),
        toChartBuildPayload(requestData),
      );
      const formattedData = this.formatDateField(response?.data ?? []);
      return formattedData;
    } catch (error) {
      console.error("Error fetching filtered chart data:", error);
      return this.formatDateField([]);
    }
  },

  transformFilters(filters) {
    const transformed: Record<string, any> = {};

    Object.keys(filters).forEach((key) => {
      transformed[key] = filters[key];
    });

    if (filters.academicYear) {
      const yearValue = parseInt(filters.academicYear) || 0;
      transformed.years = [yearValue];
      delete transformed.academicYear;
    }

    if (filters.branch) {
      if (Array.isArray(filters.branch)) {
        transformed.pk = filters.branch;
      } else {
        transformed.pk = [filters.branch];
      }
      delete transformed.branch;
    }

    if (filters.levels) {
      transformed.levels = filters.levels;
    }

    if (filters.status) {
      if (Array.isArray(filters.status)) {
        transformed.states = filters.status;
      } else {
        transformed.states = [filters.status];
      }
      delete transformed.status;
    }

    if (filters.type !== undefined) {
      const typeMap = {
        заявление: 1,
        "заявление (Б)": 2,
        физлиц: 3,
        договора: 4,
        оплата: 5,
      };

      if (typeof filters.type === "number") {
        transformed.typeCnn = filters.type;
      } else {
        transformed.typeCnn = typeMap[filters.type] || 0;
      }
      delete transformed.type;
    }

    if (
      filters.dateStart !== undefined &&
      filters.dateStart !== null &&
      filters.dateStart !== ""
    ) {
      if (filters.dateStart) {
        transformed.startDate = new Date(filters.dateStart).toISOString();
      }
      delete transformed.dateStart;
    }
    if (
      filters.dateEnd !== undefined &&
      filters.dateEnd !== null &&
      filters.dateEnd !== ""
    ) {
      if (filters.dateEnd) {
        transformed.endDate = new Date(filters.dateEnd).toISOString();
      }
      delete transformed.dateEnd;
    }

    if (
      filters.startDate !== undefined &&
      filters.startDate !== null &&
      filters.startDate !== ""
    ) {
      transformed.startDate = filters.startDate;
    }
    if (
      filters.endDate !== undefined &&
      filters.endDate !== null &&
      filters.endDate !== ""
    ) {
      transformed.endDate = filters.endDate;
    }

    if (filters.showValues !== undefined) {
      delete transformed.showValues;
    }

    return transformed;
  },

  formatDateField(data) {
    let actualData = data;
    if (data && typeof data === "object" && Array.isArray(data.data)) {
      actualData = data.data;
    }

    if (
      Array.isArray(actualData) &&
      actualData.length > 0 &&
      actualData[0].series
    ) {
      let flattenedData = [];
      actualData.forEach((yearData) => {
        if (yearData.series && Array.isArray(yearData.series)) {
          const yearSeries = yearData.series.map((seriesItem) => {
            return {
              date: seriesItem.argument,
              value: seriesItem.value,
            };
          });
          flattenedData = flattenedData.concat(yearSeries);
        }
      });
      return flattenedData;
    }

    if (Array.isArray(actualData)) {
      return actualData.map((item) => {
        if (item.date) {
          try {
            const dateObj = new Date(item.date);
            if (!isNaN(dateObj.getTime())) {
              const formattedDate = dateObj.toISOString().split("T")[0];
              return { ...item, date: formattedDate };
            }
          } catch (e) {
            return item;
          }
        }
        return item;
      });
    } else if (actualData && typeof actualData === "object") {
      if (actualData.date) {
        try {
          const dateObj = new Date(actualData.date);
          if (!isNaN(dateObj.getTime())) {
            const formattedDate = dateObj.toISOString().split("T")[0];
            return { ...actualData, date: formattedDate };
          }
        } catch (e) {
          return actualData;
        }
      }
      return actualData;
    }
    return actualData;
  },
};
