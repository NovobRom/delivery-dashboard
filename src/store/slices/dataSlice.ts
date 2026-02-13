import { create } from 'zustand';
import type { DataState } from '@/types/index';
import { parseCSV } from '@utils/csv-parser';
import { INITIAL_CSV } from '@config/constants';

const initialParse = parseCSV(INITIAL_CSV);

export const useDataStore = create<DataState>((set) => ({
    rawData: INITIAL_CSV,
    fullData: initialParse.data,
    error: initialParse.error,

    setRawData: (data: string) => {
        const result = parseCSV(data);
        set({
            rawData: data,
            fullData: result.data,
            error: result.error,
        });
    },
}));
