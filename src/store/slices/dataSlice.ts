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
        } else if (type === 'PARSE_MAPPED_COMPLETE') {
            // Transform DeliveryRecord[] to CourierData[] for the Dashboard
            const mappedRecords = payload.data.map((r: any, index: number) => ({
                ...r,
                id: index,
                dateObj: new Date(r.date), // Ensure it's a Date object
                dateStr: new Date(r.date).toLocaleDateString('uk-UA')
            }));

            set({
                deliveryRecords: payload.data,
                fullData: mappedRecords, // Populate fullData for the Dashboard
                error: payload.data.length === 0 ? 'No valid records found' : null,
                isLoading: false
            });

            if (payload.errors && payload.errors.length > 0) {
                console.warn('Import errors:', payload.errors);
            }
        } else if (type === 'ERROR') {
            set({ error: payload as string, isLoading: false });
        }
    };

    // Trigger initial parse
    worker.postMessage({ type: 'PARSE_CSV', payload: INITIAL_CSV });

    return {
        rawData: INITIAL_CSV,
        fullData: [],
        deliveryRecords: [],
        error: null,
        isLoading: true,

        setRawData: (data: string) => {
            set({ rawData: data, isLoading: true });
            worker.postMessage({ type: 'PARSE_CSV', payload: data });
        },
        importMappedData: (file: string, mapping: Record<string, string>) => {
            set({ isLoading: true, error: null });
            worker.postMessage({ type: 'PARSE_MAPPED_CSV', payload: { file, mapping } });
        },

        // Wizard Actions
        isWizardOpen: false,
        pendingFile: null,
        csvHeaders: [],
        openWizard: (file: string, headers: string[]) => {
            set({ isWizardOpen: true, pendingFile: file, csvHeaders: headers });
        },
        closeWizard: () => {
            set({ isWizardOpen: false, pendingFile: null, csvHeaders: [] });
        }
    };
});
