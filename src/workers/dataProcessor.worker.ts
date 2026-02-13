import { parseCSV } from '../utils/csv-parser';

self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    try {
        switch (type) {
            case 'PARSE_CSV':
                const result = parseCSV(payload);
                self.postMessage({ type: 'PARSE_COMPLETE', payload: result });
                break;
            // Future: Add filtering/aggregation here
            default:
                break;
        }
    } catch (error) {
        self.postMessage({
            type: 'ERROR',
            payload: error instanceof Error ? error.message : 'Unknown worker error'
        });
    }
};
