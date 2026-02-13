
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GlassCard } from '@/components/common/GlassCard';
import { useTranslation } from 'react-i18next';
import type { CourierData } from '@/types/index';

interface Props {
    data: CourierData[];
}

export const VolumeTrendChart: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();

    // Aggregate data by date
    const chartData = React.useMemo(() => {
        const stats: Record<string, { date: string, loaded: number, delivered: number, undelivered: number, sortKey: number }> = {};

        data.forEach(item => {
            if (!stats[item.dateStr]) {
                stats[item.dateStr] = {
                    date: item.dateStr.substring(0, 5),
                    loaded: 0,
                    delivered: 0,
                    undelivered: 0,
                    sortKey: item.dateObj.getTime()
                };
            }
            stats[item.dateStr].loaded += item.loaded;
            stats[item.dateStr].delivered += item.delivered;
            stats[item.dateStr].undelivered += item.undelivered;
        });

        return Object.values(stats).sort((a, b) => a.sortKey - b.sortKey);
    }, [data]);

    return (
        <GlassCard className="h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('charts.volumeTrend', 'Volume Trend')}</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="delivered" stackId="1" stroke="#10b981" fill="#10b981" name={t('common.delivered', 'Delivered')} />
                        <Area type="monotone" dataKey="undelivered" stackId="1" stroke="#ef4444" fill="#ef4444" name={t('common.undelivered', 'Undelivered')} />
                        {/* We can show Loaded as a line or just stack delivered + undelivered which roughly equals loaded (except unassigned?) */}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};
