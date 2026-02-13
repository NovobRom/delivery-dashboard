import type { CourierData, CourierStats } from '@types/index';

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
