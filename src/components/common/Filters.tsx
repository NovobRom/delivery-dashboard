import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDataStore, useFiltersStore } from '@/store';
import { MultiSelect } from './MultiSelect';
import { Icons } from './Icons';

export const CourierFilter: React.FC = () => {
    const { t } = useTranslation();
    const { fullData } = useDataStore();
    const { selectedCouriers, setSelectedCouriers } = useFiltersStore();

    const uniqueCouriers = useMemo(() => {
        if (!fullData) return [];
        const couriers = [...new Set(fullData.map(d => d.courier))];
        return couriers.filter(c => c && c.trim() !== '').sort();
    }, [fullData]);

    if (uniqueCouriers.length === 0) return null;

    return (
        <MultiSelect
            options={uniqueCouriers}
            selected={selectedCouriers}
            onChange={setSelectedCouriers}
            label={t('leaderboard.filterCouriers', 'Filter Couriers')}
            icon={Icons.Users}
        />
    );
};
