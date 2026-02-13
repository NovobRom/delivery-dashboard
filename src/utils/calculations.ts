
import type {
    CourierData,
    CourierStats,
    RegionalStats,
    HeatmapCell,
    DeliveryMethodBreakdown,
    SummaryStatistics
} from '@/types/index';

export const calculateSuccessRate = (delivered: number, loaded: number): string => {
    if (loaded === 0) return '0';
    return ((delivered / loaded) * 100).toFixed(1);
};

export const calculateDensity = (delivered: number, addresses: number): string => {
    if (addresses === 0) return '0';
    return (delivered / addresses).toFixed(2);
};

export const aggregateCourierStats = (data: CourierData[]): CourierStats[] => {
    const groups: Record<string, {
        name: string;
        delivered: number;
        loaded: number;
        addresses: number;
        noReason: number;
    }> = {};

    data.forEach(item => {
        if (!item.courier || (item.loaded === 0 && item.delivered === 0)) return;

        if (!groups[item.courier]) {
            groups[item.courier] = {
                name: item.courier,
                delivered: 0,
                loaded: 0,
                addresses: 0,
                noReason: 0
            };
        }

        groups[item.courier].delivered += item.delivered;
        groups[item.courier].loaded += item.loaded;
        groups[item.courier].addresses += item.addresses;
        groups[item.courier].noReason += item.noReason;
    });

    return Object.values(groups)
        .map(c => ({
            ...c,
            rate: calculateSuccessRate(c.delivered, c.loaded),
            density: calculateDensity(c.delivered, c.addresses),
        }))
        .sort((a, b) => b.delivered - a.delivered);
};

export const calculateTotalStats = (data: CourierData[]) => {
    const loaded = data.reduce((acc, curr) => acc + curr.loaded, 0);
    const delivered = data.reduce((acc, curr) => acc + curr.delivered, 0);
    const noReason = data.reduce((acc, curr) => acc + curr.noReason, 0);
    const avgRate = calculateSuccessRate(delivered, loaded);

    return { loaded, delivered, avgRate, noReason };
};

export const calculateMedian = (values: number[]): number => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

export const calculateDeliveryMethodBreakdown = (data: CourierData[]): DeliveryMethodBreakdown => {
    const hand = data.reduce((acc, curr) => acc + curr.hand, 0);
    const safeplace = data.reduce((acc, curr) => acc + curr.safeplace, 0);
    const undelivered = data.reduce((acc, curr) => acc + curr.undelivered, 0);

    return {
        hand,
        safeplace,
        undelivered,
        total: hand + safeplace + undelivered
    };
};

export const calculateRegionalStats = (data: CourierData[]): RegionalStats[] => {
    const groups: Record<string, { delivered: number; loaded: number }> = {};

    data.forEach(item => {
        if (!groups[item.unit]) {
            groups[item.unit] = { delivered: 0, loaded: 0 };
        }
        groups[item.unit].delivered += item.delivered;
        groups[item.unit].loaded += item.loaded;
    });

    return Object.entries(groups).map(([region, stats]) => ({
        region,
        successRate: stats.loaded > 0 ? (stats.delivered / stats.loaded) * 100 : 0,
        volume: stats.loaded
    })).sort((a, b) => b.successRate - a.successRate);
};

export const calculateHeatmapData = (data: CourierData[]): HeatmapCell[] => {
    return data.map(item => ({
        courier: item.courier,
        date: item.dateStr,
        rate: item.successRate
    }));
};

export const findBestWorstDays = (data: CourierData[]): { best: { date: string; rate: number } | null; worst: { date: string; rate: number } | null } => {
    const dailyStats: Record<string, { delivered: number; loaded: number }> = {};

    data.forEach(item => {
        if (!dailyStats[item.dateStr]) {
            dailyStats[item.dateStr] = { delivered: 0, loaded: 0 };
        }
        dailyStats[item.dateStr].delivered += item.delivered;
        dailyStats[item.dateStr].loaded += item.loaded;
    });

    let best = { date: '', rate: -1 };
    let worst = { date: '', rate: 101 };

    Object.entries(dailyStats).forEach(([date, stats]) => {
        if (stats.loaded === 0) return;
        const rate = (stats.delivered / stats.loaded) * 100;
        if (rate > best.rate) best = { date, rate };
        if (rate < worst.rate) worst = { date, rate };
    });

    return {
        best: best.rate !== -1 ? best : null,
        worst: worst.rate !== 101 ? worst : null
    };
};

export const calculateActiveCouriers = (data: CourierData[]): number => {
    const couriers = new Set(data.map(d => d.courier));
    return couriers.size;
};

export const calculateSummaryStatistics = (data: CourierData[]): SummaryStatistics => {
    const rates = data.map(d => d.successRate);
    const medianRate = calculateMedian(rates);

    const { best, worst } = findBestWorstDays(data);

    const uniqueCouriers = calculateActiveCouriers(data);

    const uniqueDays = new Set(data.map(d => d.dateStr)).size;

    let dateRange = null;
    if (data.length > 0) {
        const sorted = [...data].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        dateRange = {
            start: sorted[0].dateStr,
            end: sorted[sorted.length - 1].dateStr
        };
    }

    return {
        medianRate,
        bestDay: best,
        worstDay: worst,
        totalRows: data.length,
        totalDays: uniqueDays,
        uniqueCouriers,
        dateRange
    };
};
