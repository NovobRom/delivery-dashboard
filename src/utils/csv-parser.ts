import type { CourierData } from '@types/index';

export const parseCSV = (csvText: string): CourierData[] => {
    if (!csvText) return [];

    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const firstLine = lines[0];
    let delimiter = ',';
    if (firstLine.includes('\t')) delimiter = '\t';
    else if (firstLine.includes(';')) delimiter = ';';

    const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));

    const idx = {
        date: headers.findIndex(h => h.includes('Дата відомості')),
        courier: headers.findIndex(h => h.includes("ПІБ кур'єра")),
        unit: headers.findIndex(h => h.includes('Підрозділ відомості')),
        addresses: headers.findIndex(h => h.includes('К-сть адрес')),
        loaded: headers.findIndex(h => h.includes('К-сть завантажених ШК')),
        delivered: headers.findIndex(h => h.includes('К-сть доставлених ШК на дату відомості')),
        hand: headers.findIndex(h => h.includes('"В руки"')),
        safeplace: headers.findIndex(h => h.includes('"SafePlace"')),
        undelivered: headers.findIndex(h => h.includes('К-сть недоставлених ШК на дату відомості')),
        noReason: headers.findIndex(h => h.includes('К-сть недоставлених ШК без причини')),
        percent: headers.findIndex(h => h.includes('Відсоток доставлених ШК')),
    };

    const data = lines.slice(1).map((line, index) => {
        let row: string[];
        if (delimiter === '\t') {
            row = line.split('\t');
        } else if (delimiter === ';') {
            row = line.split(';');
        } else {
            row = line.match(/(\".*?\"|[^\",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
        }

        const clean = (val: string | undefined): string => val ? val.replace(/^\"|\"$/g, '').trim() : '';
        const num = (val: string | undefined): number => {
            let v = clean(val);
            if (!v) return 0;

            const isPercent = v.includes('%');
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

        return {
            id: index,
            dateStr: clean(row[idx.date]),
            dateObj: parseDateString(clean(row[idx.date])),
            courier: clean(row[idx.courier]),
            unit: idx.unit > -1 ? clean(row[idx.unit]) : 'Unknown',
            addresses: num(row[idx.addresses]),
            loaded: num(row[idx.loaded]),
            delivered: num(row[idx.delivered]),
            hand: num(row[idx.hand]),
            safeplace: num(row[idx.safeplace]),
            undelivered: num(row[idx.undelivered]),
            noReason: num(row[idx.noReason]),
            successRate: successRate
        };
    }).filter((item): item is CourierData => item !== null && !!item.dateStr);

    return data.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
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
