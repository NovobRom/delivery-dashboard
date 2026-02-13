export const getWeekNumber = (d: Date): { year: number; week: number } => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return { year: date.getUTCFullYear(), week: weekNo };
};

export const parseDateString = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const parts = dateStr.split(/[.-]/).map(Number);
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return new Date(year, month - 1, day);
    }
    return new Date();
};

export const formatDateRange = (start: string, end: string): string => {
    if (!start || !end) return '';
    return `${start.slice(5)} - ${end.slice(5)}`;
};

export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
    return date >= start && date <= end;
};

export const getDateRangeBounds = (rangeType: string): { start: Date; end: Date } | null => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    switch (rangeType) {
        case 'this_month':
            return {
                start: new Date(currentYear, currentMonth, 1),
                end: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999)
            };

        case 'last_month': {
            const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
            return {
                start: lastMonthDate,
                end: new Date(currentYear, currentMonth, 0, 23, 59, 59, 999)
            };
        }

        case 'this_week': {
            // const { year: cy, week: cw } = getWeekNumber(today);
            // Simplified - would need more complex logic for exact week bounds
            return null;
        }

        case 'last_7': {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            sevenDaysAgo.setHours(0, 0, 0, 0);
            return {
                start: sevenDaysAgo,
                end: today
            };
        }

        default:
            return null;
    }
};
