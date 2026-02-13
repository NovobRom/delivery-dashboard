import { create } from 'zustand';
import type { DataState, CourierData } from '@types/index';
import { parseCSV } from '@utils/csv-parser';
import { INITIAL_CSV } from '@config/constants';

export const useDataStore = create<DataState>((set) => ({
    rawData: INITIAL_CSV,
    fullData: parseCSV(INITIAL_CSV),

    setRawData: (data: string) => set({
        rawData: data,
        fullData: parseCSV(data),
    }),
}));
