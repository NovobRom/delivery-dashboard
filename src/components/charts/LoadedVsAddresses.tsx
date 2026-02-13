import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GlassCard } from '@/components/common/GlassCard';
import { useTranslation } from 'react-i18next';
import type { CourierData } from '@/types/index';

interface Props {
    data: CourierData[];
}

export const LoadedVsAddresses: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();

    const chartData = useMemo(() => {
        const stats: Record<string, { date: string, loaded: number, addresses: number, sortKey: number }> = {};

        data.forEach(item => {
            if (!stats[item.dateStr]) {
                stats[item.dateStr] = {
                    date: item.dateStr.substring(0, 5),
                    loaded: 0,
                    addresses: 0,
                    sortKey: item.dateObj.getTime()
                };
            }
            stats[item.dateStr].loaded += item.loaded;
            stats[item.dateStr].addresses += item.addresses;
        });

        return Object.values(stats).sort((a, b) => a.sortKey - b.sortKey);
    }, [data]);

    // Calculate totals for summary
    const totalLoaded = chartData.reduce((acc, curr) => acc + curr.loaded, 0);
    const totalAddresses = chartData.reduce((acc, curr) => acc + curr.addresses, 0);
    const ratio = totalAddresses > 0 ? (totalLoaded / totalAddresses).toFixed(2) : '0';

    return (
        <GlassCard className="h-96 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-100">
                        {t('charts.loadedVsAddresses', 'Loaded vs Addresses')}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                        {t('charts.loadedVsAddressesSubtitle', 'Packages per address density')}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                        {ratio}
                    </div>
                    <div className="text-xs text-slate-500">
                        {t('kpi.addressCoverage', 'Avg Parcels/Address')}
                    </div>
                </div>
            </div>

            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '8px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                        />
                        <Legend iconType="circle" />
                        <Bar
                            dataKey="loaded"
                            name={t('kpi.loaded', 'Loaded')}
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                        <Bar
                            dataKey="addresses"
                            name={t('kpi.addresses', 'Addresses')}
                            fill="#cbd5e1"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={50}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};
