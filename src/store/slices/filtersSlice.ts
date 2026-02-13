import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FiltersState, DateRangeType, CustomDateRange, AggregationMode } from '@types/index';

export const useFiltersStore = create<FiltersState>()(
    persist(
        (set) => ({
            selectedUnits: [],
            selectedCouriers: [],
            dateRange: 'all',
            customDateRange: { start: '', end: '' },
            aggMode: 'day',

            setSelectedUnits: (units) => set({ selectedUnits: units }),
            setSelectedCouriers: (couriers) => set({ selectedCouriers: couriers }),
            setDateRange: (range: DateRangeType) => set({ dateRange: range }),
            setCustomDateRange: (range: CustomDateRange) => set({ customDateRange: range }),
            setAggMode: (mode: AggregationMode) => set({ aggMode: mode }),

            resetFilters: () => set({
                selectedUnits: [],
                selectedCouriers: [],
                dateRange: 'all',
                customDateRange: { start: '', end: '' },
                aggMode: 'day',
            }),
        }),
        {
            name: 'delivery-dashboard-filters',
            partialize: (state) => ({
                dateRange: state.dateRange,
                aggMode: state.aggMode,
            }),
        }
    )
);
