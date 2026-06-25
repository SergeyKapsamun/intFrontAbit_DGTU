import { defineStore } from "pinia";
import { getDBs, getYears } from "@/entities/db/api/db-api";

export const useDbStore = defineStore("dbStore", {
  state: () => ({
    selectedDB: "Абитуриенты",
    DBs: [],
    ip: "",
    role: "",
    years: [],
  }),
  getters: {
    getSelectedDB: (state) => state.selectedDB,
    getRole: (state) => state.role,
    getIp: (state) => state.ip,
    getYears: (state) => state.years,
  },
  actions: {
    setSelectedRole(role) {
      this.role = role;
    },
    setSelectedDb(db) {
      this.selectedDB = db;
    },
    setIp(ip) {
      this.ip = ip || "";
    },
    setYears(years) {
      this.years = Array.isArray(years) ? years : [];
    },
    async selectRole(role) {
      this.setSelectedRole(role);
      const dbMeta = await getDBs(role);
      this.DBs = Array.isArray(dbMeta?.databases) ? dbMeta.databases : [];
      this.setIp(dbMeta?.ip || "");

      const years = await getYears(this.selectedDB, 1);
      this.setYears(years);
      return { dbMeta, years };
    },
  },
});
