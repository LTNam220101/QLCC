import { create } from "zustand";
import { ReportFilter } from "../../../types/reports";

interface ReportFilterState {
  filter: ReportFilter;
  setFilter: (filter: Partial<ReportFilter>) => void;
  resetFilter: () => void;
}

const initialFilter: ReportFilter = {
  status: undefined,
  reportContent: "",
  buildingId: "",
  apartmentId: "",
  createTimeFrom: undefined,
  createTimeTo: undefined,
  page: 0,
  size: 20,
};

export const useReportFilterStore = create<ReportFilterState>()((set) => ({
  filter: initialFilter,
  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),
  resetFilter: () => set({ filter: initialFilter }),
}));
