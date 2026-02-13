import { z } from 'zod';
import type { CourierData, ParseResult } from '@/types/index';

export class ParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ParseError';
    }
}

// Helper to parse European number formats (e.g. "1.234,56" or "98,5%")
const parseEuroNumber = (val: unknown): number => {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return 0;

    let v = val.trim();
    if (!v) return 0;

    v = v.replace('%', '').replace(/\s/g, '');
    // If it has a comma but no dot, replace comma with dot (e.g. "98,5" -> "98.5")
    if (v.includes(',') && !v.includes('.')) {
        v = v.replace(',', '.');
    }

    const parsed = parseFloat(v);
    return isNaN(parsed) ? 0 : parsed;
};

// Helper for date parsing
const parseDateString = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    // Assuming DD.MM.YYYY or DD-MM-YYYY
    const parts = dateStr.split(/[.-]/).map(Number);
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(year, month - 1, day);
    }
    return new Date();
};

const courierDataSchema = z.object({
    id: z.number(),
    dateStr: z.string(),
    dateObj: z.date(),
    courier: z.string().min(1, "Courier name is required"),
    unit: z.string().default('Unknown'),
    addresses: z.preprocess(parseEuroNumber, z.number().nonnegative()),
    loaded: z.preprocess(parseEuroNumber, z.number().nonnegative()),
    delivered: z.preprocess(parseEuroNumber, z.number().nonnegative()),
    hand: z.preprocess(parseEuroNumber, z.number().default(0)),
    safeplace: z.preprocess(parseEuroNumber, z.number().default(0)),
    undelivered: z.preprocess(parseEuroNumber, z.number().default(0)),
    noReason: z.preprocess(parseEuroNumber, z.number().default(0)),
    successRate: z.preprocess(parseEuroNumber, z.number().min(0).max(100))
});

export const parseCSV = (csvText: string): ParseResult => {
    try {
        if (!csvText) return { data: [], error: null };

        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return { data: [], error: null };

        const firstLine = lines[0];
        let delimiter = ',';
        if (firstLine.includes('\t')) delimiter = '\t';
        else if (firstLine.includes(';')) delimiter = ';';

        // Basic validation of header
        if (!firstLine.includes('Дата') && !firstLine.includes('Date')) {
            throw new ParseError('Invalid CSV header. Expected "Date" or "Дата" column.');
        }

        const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));

        const idx = {
            date: headers.findIndex(h => h.includes('Дата відомості') || h.includes('Date')),
            courier: headers.findIndex(h => h.includes("ПІБ кур'єра") || h.includes('Courier')),
            unit: headers.findIndex(h => h.includes('Підрозділ відомості') || h.includes('Unit')),
            addresses: headers.findIndex(h => h.includes('К-сть адрес') || h.includes('Addresses')),
            loaded: headers.findIndex(h => h.includes('К-сть завантажених ШК') || h.includes('Loaded')),
            delivered: headers.findIndex(h => h.includes('К-сть доставлених ШК на дату відомості') || h.includes('Delivered')),
            hand: headers.findIndex(h => h.includes('"В руки"') || h.includes('Hand')),
            safeplace: headers.findIndex(h => h.includes('"SafePlace"') || h.includes('SafePlace')),
            undelivered: headers.findIndex(h => h.includes('К-сть недоставлених ШК на дату відомості') || h.includes('Undelivered')),
            noReason: headers.findIndex(h => h.includes('К-сть недоставлених ШК без причини') || h.includes('No Reason')),
            percent: headers.findIndex(h => h.includes('Відсоток доставлених ШК') || h.includes('Percent')),
        };

        if (idx.date === -1) throw new ParseError('Missing required column: Date');

        const parsedData: CourierData[] = [];

        lines.slice(1).forEach((line, index) => {
            try {
                let row: string[];
                if (delimiter === '\t') {
                    row = line.split('\t');
                } else if (delimiter === ';') {
                    row = line.split(';');
                } else {
                    row = line.match(/(\".*?\"|[^\",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
                }

                if (!row || row.length < headers.length * 0.5) return;

                const clean = (val: string | undefined): string => val ? val.replace(/^\"|\"$/g, '').trim() : '';

                if (!row[idx.date]) return;

                const rawDateStr = clean(row[idx.date]);

                // Pre-calculate values to match schema expectations
                let successRate = parseEuroNumber(clean(row[idx.percent]));
                // Normalize percentage
                if (successRate <= 1 && successRate > 0 && !clean(row[idx.percent]).includes('%')) {
                    // heuristic: if it's 0.95 and no % sign, treat as 95%
                    successRate *= 100;
                }

                const loaded = parseEuroNumber(clean(row[idx.loaded]));
                const delivered = parseEuroNumber(clean(row[idx.delivered]));

                // Helper recalculation if missing
                if (successRate === 0 && loaded > 0) {
                    successRate = (delivered / loaded) * 100;
                }

                const rawObj = {
                    id: index,
                    dateStr: rawDateStr,
                    dateObj: parseDateString(rawDateStr),
                    courier: clean(row[idx.courier]),
                    unit: idx.unit > -1 ? clean(row[idx.unit]) : 'Unknown',
                    addresses: clean(row[idx.addresses]),
                    loaded: clean(row[idx.loaded]),
                    delivered: clean(row[idx.delivered]),
                    hand: clean(row[idx.hand]),
                    safeplace: clean(row[idx.safeplace]),
                    undelivered: clean(row[idx.undelivered]),
                    noReason: clean(row[idx.noReason]),
                    successRate: successRate
                };

                const result = courierDataSchema.safeParse(rawObj);

                if (result.success) {
                    parsedData.push(result.data as CourierData);
                } else {
                    console.warn(`Row ${index + 2} validation failed:`, result.error);
                }
            } catch (e) {
                console.warn(`Error parsing line ${index + 2}:`, e);
            }
        });

        return {
            data: parsedData.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()),
            error: null
        };
    } catch (error) {
        console.error("CSV Parse Error:", error);
        return {
            data: [],
            error: error instanceof Error ? error.message : 'Unknown parsing error'
        };
    }
};
