import type { CourierData, ParseResult } from '@/types/index';

export class ParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ParseError';
    }
}

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

        const data = lines.slice(1).map((line, index) => {
            try {
                let row: string[];
                if (delimiter === '\t') {
                    row = line.split('\t');
                } else if (delimiter === ';') {
                    row = line.split(';');
                } else {
                    row = line.match(/(\".*?\"|[^\",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
                }

                if (!row || row.length < headers.length * 0.5) return null; // Skip malformed lines

                const clean = (val: string | undefined): string => val ? val.replace(/^\"|\"$/g, '').trim() : '';
                const num = (val: string | undefined): number => {
                    let v = clean(val);
                    if (!v) return 0;

                    v = v.replace('%', '').replace(/\s/g, '');
                    if (v.includes(',') && !v.includes('.')) v = v.replace(',', '.');

                    let parsed = parseFloat(v);
                    if (isNaN(parsed)) return 0;
                    return parsed;
                };

                if (!row[idx.date]) return null;

                let successRate = num(row[idx.percent]);
                const rawPercent = clean(row[idx.percent]);

                if (!rawPercent.includes('%') && successRate <= 1 && successRate > 0) {
                    successRate = successRate * 100;
                }

                // Recalculate if 0 to be sure
                const delivered = num(row[idx.delivered]);
                const loaded = num(row[idx.loaded]);
                if (successRate === 0 && loaded > 0) {
                    successRate = (delivered / loaded) * 100;
                }

                return {
                    id: index,
                    dateStr: clean(row[idx.date]),
                    dateObj: parseDateString(clean(row[idx.date])),
                    courier: clean(row[idx.courier]),
                    unit: idx.unit > -1 ? clean(row[idx.unit]) : 'Unknown',
                    addresses: num(row[idx.addresses]),
                    loaded: loaded,
                    delivered: delivered,
                    hand: num(row[idx.hand]),
                    safeplace: num(row[idx.safeplace]),
                    undelivered: num(row[idx.undelivered]),
                    noReason: num(row[idx.noReason]),
                    successRate: successRate
                };
            } catch (e) {
                console.warn(`Error parsing line ${index + 2}:`, e);
                return null;
            }
        }).filter((item): item is CourierData => item !== null && !!item.dateStr);

        return { data: data.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime()), error: null };
    } catch (error) {
        console.error("CSV Parse Error:", error);
        return {
            data: [],
            error: error instanceof Error ? error.message : 'Unknown parsing error'
        };
    }
};

const parseDateString = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split(/[.-]/).map(Number);
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(year, month - 1, day);
    }
    return new Date();
};
