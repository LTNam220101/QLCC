import { create } from "zustand";
import { MovingTicketFilter } from "../../../types/moving-tickets";

interface MovingTicketFilterState {
  filter: MovingTicketFilter;
  setFilter: (filter: Partial<MovingTicketFilter>) => void;
  resetFilter: () => void;
}

const initialFilter: MovingTicketFilter = {
  transferType: undefined,
  ticketCode: "",
  movingDayTimeFrom: undefined,
  movingDayTimeTo: undefined,
  manageBuildingList: undefined,
  manageApartmentList: undefined,
  page: 0,
  size: 20,
};

export const useMovingTicketFilterStore = create<MovingTicketFilterState>()(
  (set) => ({
    filter: initialFilter,
    setFilter: (newFilter) =>
      set((state) => ({
        filter: { ...state.filter, ...newFilter },
      })),
    resetFilter: () => set({ filter: initialFilter }),
  })
);
