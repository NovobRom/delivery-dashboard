
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { GlassCard } from '@/components/common/GlassCard';
import { useTranslation } from 'react-i18next';
import { calculateRegionalStats } from '@/utils/calculations';
import type { CourierData } from '@/types/index';

interface Props {
    data: CourierData[];
}

export const RegionalComparisonChart: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();
    const stats = calculateRegionalStats(data);

    // Take top 10 regions to avoid clutter
    const chartData = stats.slice(0, 10).map(s => ({
        name: s.region.replace('AdressDelivery-OWN-LT-', '').substring(0, 15), // Shorten name for Axis
        fullName: s.region, // Full name for Tooltip
        successRate: parseFloat(s.successRate.toFixed(1)),
        volume: s.volume
    }));

    return (
        <GlassCard className="h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('charts.regionalComparison', 'Regional Comparison')}</h3>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-white/95 p-3 rounded-lg shadow-lg border border-slate-100">
                                            <p className="font-semibold text-slate-800 mb-1">{data.fullName}</p>
                                            <p className="text-sm text-emerald-600">
                                                {t('common.successRate', 'Success Rate')}: {data.successRate}%
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {t('common.volume', 'Volume')}: {data.volume}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend />
                        <Bar dataKey="successRate" fill="#10b981" name={t('common.successRate', 'Success Rate %')} radius={[0, 4, 4, 0]} barSize={20}>
                            <LabelList dataKey="successRate" position="right" fill="#334155" fontSize={12} formatter={(val: number) => `${val}%`} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};
