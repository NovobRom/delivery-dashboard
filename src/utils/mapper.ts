import { DeliveryRecord } from '../types/schema';

// Dictionary mapping internal keys to possible CSV header synonyms (case-insensitive)
// Based on user's structure: "№	Дата відомості	ПІБ кур'єра	Номер авто	Підрозділ відомості..."
export const COLUMN_MATCHERS: Record<keyof DeliveryRecord, string[]> = {
    date: ['Дата відомості', 'Date', 'Дата', 'Time'],
    courier: ['ПІБ кур\'єра', 'Courier', 'Driver', 'Водій', 'ПІБ'],
    unit: ['Підрозділ відомості', 'Unit', 'Branch', 'Підрозділ', 'Region', 'City'],
    addresses: ['К-сть адрес', 'Addresses', 'Qty', 'Total'],
    loaded: ['К-сть завантажених ШК', 'Loaded', 'Завантажено'],
    delivered: ['К-сть доставлених ШК на дату відомості', 'Delivered', 'Доставлено'],
    hand: ['К-сть доставлених ШК на дату відомості "В руки"', 'Hand', 'В руки'],
    safeplace: ['К-сть доставлених ШК на дату відомості "SafePlace"', 'SafePlace', 'Safe Place'],
    undelivered: ['К-сть недоставлених ШК на дату відомості', 'Undelivered', 'Недоставлено'],
    noReason: ['К-сть недоставлених ШК без причини', 'No Reason', 'Без причини'],
    successRate: ['Відсоток доставлених ШК', 'Success Rate', '%', 'Rate']
};

/**
 * Guesses the mapping between internal schema keys and CSV headers.
 * @param csvHeaders List of headers from the uploaded CSV file.
 * @returns A record mapping internal keys to the best matching CSV header.
 */
export const guessMapping = (csvHeaders: string[]): Record<string, string> => {
    const mapping: Record<string, string> = {};
    const usedHeaders = new Set<string>();

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9а-яіїє%]/g, '');

    // Iterate over each field in our schema
    for (const [key, synonyms] of Object.entries(COLUMN_MATCHERS)) {
        let bestMatch = '';
        let matchScore = 0; // Simple score: 2 = exact synonym match, 1 = partial match

        for (const header of csvHeaders) {
            if (usedHeaders.has(header)) continue;

            const normHeader = normalize(header);

            // Check against synonyms
            for (const synonym of synonyms) {
                const normSynonym = normalize(synonym);

                if (normHeader === normSynonym) {
                    bestMatch = header;
                    matchScore = 2; // Exact match found, stop looking for this key
                    break;
                }

                if (normHeader.includes(normSynonym) && matchScore < 1) {
                    bestMatch = header;
                    matchScore = 1; // Partial match
                }
            }
            if (matchScore === 2) break;
        }

        if (bestMatch) {
            mapping[key] = bestMatch;
            usedHeaders.add(bestMatch);
        }
    }

    return mapping;
};
