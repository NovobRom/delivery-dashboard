
import React, { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDataStore, useFiltersStore } from '@/store';
import { KPISection } from './KPISection';
import { SummaryPanel } from './SummaryPanel';
import { DeliveryMethodChart } from '@/components/charts/DeliveryMethodChart';
import { RegionalComparisonChart } from '@/components/charts/RegionalComparisonChart';
import { CourierHeatmap } from '@/components/charts/CourierHeatmap';
import { VolumeTrendChart } from '@/components/charts/VolumeTrendChart';
import { LoadedVsAddresses } from '@/components/charts/LoadedVsAddresses';
import { CourierFilter } from '@/components/common/Filters';
import { getWeekNumber } from '@/utils/date-utils';


const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const { fullData, error } = useDataStore();
    const {
        selectedUnits, setSelectedUnits,
        selectedCouriers,
        dateRange, customDateRange
    } = useFiltersStore();

    // Initialize unique units selection if not set
    const uniqueUnits = useMemo(() => {
        if (!fullData) return [];
        const units = [...new Set(fullData.map(d => d.unit))];
        return units.filter(u => u && u !== 'Unknown').sort();
    }, [fullData]);

    useEffect(() => {
        if (uniqueUnits.length > 0 && selectedUnits.length === 0) {
            setSelectedUnits(uniqueUnits);
        }
    }, [uniqueUnits, selectedUnits.length, setSelectedUnits]);

    // Apply Filters
    const filteredData = useMemo(() => {
        if (!fullData || fullData.length === 0) return [];
        if (selectedUnits.length === 0) return [];

        let result = fullData.filter(d => selectedUnits.includes(d.unit));

        // Date Filter
        if (dateRange !== 'all') {
            const today = new Date();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();

            if (dateRange === 'custom') {
                if (customDateRange.start && customDateRange.end) {
                    const startDate = new Date(customDateRange.start);
                    startDate.setHours(0, 0, 0, 0);

                    const endDate = new Date(customDateRange.end);
                    endDate.setHours(23, 59, 59, 999);

                    result = result.filter(d => d.dateObj >= startDate && d.dateObj <= endDate);
                }
            } else {
                result = result.filter(d => {
                    const dDate = d.dateObj;
                    if (dateRange === 'this_month') {
                        return dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
                    }
                    if (dateRange === 'last_month') {
                        const lastMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                        return dDate.getMonth() === lastMonthDate.getMonth() && dDate.getFullYear() === lastMonthDate.getFullYear();
                    }
                    if (dateRange === 'this_week') {
                        const { year: dy, week: dw } = getWeekNumber(dDate);
                        const { year: cy, week: cw } = getWeekNumber(today);
                        return dy === cy && dw === cw;
                    }
                    if (dateRange === 'last_7') {
                        const sevenDaysAgo = new Date();
                        sevenDaysAgo.setDate(today.getDate() - 7);
                        sevenDaysAgo.setHours(0, 0, 0, 0);
                        return dDate >= sevenDaysAgo;
                    }
                    return true;
                });
            }
        }

        if (selectedCouriers.length > 0) {
            result = result.filter(d => selectedCouriers.includes(d.courier));
        }

        return result;
    }, [fullData, selectedUnits, dateRange, customDateRange, selectedCouriers]);

    if (error) {
        throw new Error(error);
    }

    if (!fullData || fullData.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-slate-500">{t('common.noItemsFound', 'No data available. Please upload a CSV file.')}</p>
            </div>
        );
    }

    const displayData = filteredData;

    return (
        <div className="space-y-6 pb-12">
            {/* Header / Intro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-gray-100">{t('dashboard.overview', 'Overview')}</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">
                        {t('dashboard.subtitle', 'Analytics and performance metrics')}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <CourierFilter />
                </div>
            </div>

            {/* Summary Statistics Panel */}
            <SummaryPanel data={displayData} />

            {/* KPI Cards */}
            <KPISection data={displayData} />

            {/* Charts Section 1: Distribution & Regional */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <DeliveryMethodChart data={displayData} />
                </div>
                <div className="lg:col-span-2">
                    <RegionalComparisonChart data={displayData} />
                </div>
            </div>

            {/* Charts Section 2: Trends & Heatmap */}
            <div className="grid grid-cols-1 gap-6">
                <VolumeTrendChart data={displayData} />
                <LoadedVsAddresses data={displayData} />
                <CourierHeatmap data={displayData} />
            </div>
        </div>
    );
};

export default Dashboard;
