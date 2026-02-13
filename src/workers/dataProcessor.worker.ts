import { parseCSV, parseMappedCSV } from '../utils/csv-parser';

self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    try {
        switch (type) {
            case 'PARSE_CSV':
                const result = parseCSV(payload);
                self.postMessage({ type: 'PARSE_COMPLETE', payload: result });
                break;
            case 'PARSE_MAPPED_CSV':
                const { file, mapping } = payload;
                const mappedResult = parseMappedCSV(file, mapping);
                self.postMessage({ type: 'PARSE_MAPPED_COMPLETE', payload: mappedResult });
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
