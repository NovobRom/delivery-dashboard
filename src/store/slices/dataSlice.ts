import { create } from 'zustand';
import type { DataState } from '@/types/index';
import { INITIAL_CSV } from '@/config/constants';

// Create worker instance
const worker = new Worker(new URL('../../workers/dataProcessor.worker.ts', import.meta.url), { type: 'module' });

export const useDataStore = create<DataState>((set) => {
    // Setup message handler
    worker.onmessage = (e: MessageEvent) => {
        const { type, payload } = e.data;
        if (type === 'PARSE_COMPLETE') {
            set({ fullData: payload.data, error: payload.error, isLoading: false });
        } else if (type === 'ERROR') {
            set({ error: payload as string, isLoading: false });
        }
    };

    // Trigger initial parse
    worker.postMessage({ type: 'PARSE_CSV', payload: INITIAL_CSV });

    return {
        rawData: INITIAL_CSV,
        fullData: [],
        error: null,
        isLoading: true,

        setRawData: (data: string) => {
            set({ rawData: data, isLoading: true });
            worker.postMessage({ type: 'PARSE_CSV', payload: data });
        },
    };
});
