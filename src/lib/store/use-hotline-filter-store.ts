import { create } from "zustand";
import { HotlineFilter } from "../../../types/hotlines";

interface HotlineFilterState {
  filter: HotlineFilter;
  setFilter: (filter: Partial<HotlineFilter>) => void;
  resetFilter: () => void;
}

const initialFilter: HotlineFilter = {
  statusList: undefined,
  name: undefined,
  hotline: undefined,
  manageBuildingList: undefined,
  createTimeFrom: undefined,
  createTimeTo: undefined,
  page: 0,
  size: 20,
};

export const useHotlineFilterStore = create<HotlineFilterState>()((set) => ({
  filter: initialFilter,
  setFilter: (newFilter) =>
    set((state) => ({
      filter: { ...state.filter, ...newFilter },
    })),
  resetFilter: () => set({ filter: initialFilter }),
}));
