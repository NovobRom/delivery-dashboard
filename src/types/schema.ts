import { z } from 'zod';
import { parse } from 'date-fns';



// Helper to parse currency strings like "$1,200.50" or "1.200,50"
const parseCurrency = (val: unknown): number => {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return 0;

    let v = val.trim();
    if (!v) return 0;

    // Remove currency symbols and spaces
    v = v.replace(/[^\d.,-]/g, '');

    // Handle European format "1.234,56" -> "1234.56"
    // Heuristic: if last punctuation is comma and there are dots before it
    if (v.includes(',') && v.indexOf(',') > v.lastIndexOf('.')) {
        // This looks like standard 1,234.56
    } else if (v.includes(',') && !v.includes('.')) {
        // "123,50" -> "123.50"
        v = v.replace(',', '.');
    } else if (v.includes('.') && v.includes(',') && v.lastIndexOf(',') < v.lastIndexOf('.')) {
        // "1.234,50" (Euro style? actually usually dot is thousands)
        // Let's stick to a simpler safe heuristic: 
        // If comma is the last separator, it's likely decimal in Euro
    }

    // Simplified approach for robust parsing:
    // 1. Remove all non-numeric characters except . and ,
    // 2. If both exist, assume the last one is decimal separator
    // 3. If only one exists, check context (often difficult blindly)
    // Let's use a standard robust string-to-number

    // For now, let's use the existing logic from csv-parser if applicable, or a robust one:
    v = v.replace(/,/g, '.'); // blindly replace commas with dots for simple cases if no conflict
    // Re-evaluating: standard "1,000.00" vs "1.000,00"
    // Let's try to be smart about the last separator.

    // safe approach: keep only digits, minus, and the LAST separator
    // This is complex. Let's start with a simpler transform that handles standard + comma decimals

    const clean = val.toString().replace(/[^0-9.,-]/g, '');
    // If it has ',' and '.'
    if (clean.includes(',') && clean.includes('.')) {
        if (clean.lastIndexOf(',') > clean.lastIndexOf('.')) {
            // 1.234,56 -> remove dots, replace comma with dot
            return parseFloat(clean.replace(/\./g, '').replace(',', '.'));
        } else {
            // 1,234.56 -> remove commas
            return parseFloat(clean.replace(/,/g, ''));
        }
    } else if (clean.includes(',')) {
        // 123,45 -> 123.45 (Euro) OR 1,234 (US integer)
        // This is ambiguous. But usually in "Price" columns, 123,45 is decimal.
        // Let's assume comma is decimal if it's not following 3 digits pattern exactly?
        // Let's just replace , with .
        return parseFloat(clean.replace(',', '.'));
    }

    return parseFloat(clean);
};

// Date parser that tries multiple formats
const parseFlexibleDate = (val: string): Date => {
    const formats = [
        'yyyy-MM-dd',
        'dd.MM.yyyy',
        'dd/MM/yyyy',
        'MM/dd/yyyy',
        'dd-MM-yyyy'
    ];

    for (const fmt of formats) {
        const d = parse(val, fmt, new Date());
        if (!isNaN(d.getTime())) return d;
    }

    // Fallback to JS Date
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;

    return new Date(); // Invalid date fallback (or throw?)
};

export const DeliveryRecordSchema = z.object({
    date: z.preprocess((val) => {
        if (typeof val === 'string') return parseFlexibleDate(val);
        return val;
    }, z.date()),
    courier: z.string().min(1, "Courier is required"),
    unit: z.string().optional(),
    addresses: z.preprocess(parseCurrency, z.number().default(0)),
    loaded: z.preprocess(parseCurrency, z.number().default(0)),
    delivered: z.preprocess(parseCurrency, z.number().default(0)),
    hand: z.preprocess(parseCurrency, z.number().default(0)),
    safeplace: z.preprocess(parseCurrency, z.number().default(0)),
    undelivered: z.preprocess(parseCurrency, z.number().default(0)),
    noReason: z.preprocess(parseCurrency, z.number().default(0)),
    successRate: z.preprocess(parseCurrency, z.number().default(0)),
});

export type DeliveryRecord = z.infer<typeof DeliveryRecordSchema>;

// Required fields for the UI mapping
export interface SchemaField {
    key: keyof DeliveryRecord;
    label: string;
    required: boolean;
}

export const SCHEMA_FIELDS: SchemaField[] = [
    { key: 'date', label: 'Date (Дата)', required: true },
    { key: 'courier', label: 'Courier (Кур\'єр)', required: true },
    { key: 'unit', label: 'Unit (Підрозділ)', required: false },
    { key: 'addresses', label: 'Addresses (Адреси)', required: false },
    { key: 'loaded', label: 'Loaded (Завантажено)', required: false },
    { key: 'delivered', label: 'Delivered (Доставлено)', required: false },
    { key: 'hand', label: 'Hand (В руки)', required: false },
    { key: 'safeplace', label: 'SafePlace', required: false },
    { key: 'undelivered', label: 'Undelivered (Недоставлено)', required: false },
    { key: 'noReason', label: 'No Reason (Без причини)', required: false },
    { key: 'successRate', label: 'Success Rate (%)', required: false },
];
