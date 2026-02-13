
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
        name: s.region.replace('AdressDelivery-OWN-LT-', '').substring(0, 15), // Shorten name
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
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Legend />
                        <Bar dataKey="successRate" fill="#10b981" name={t('common.successRate', 'Success Rate %')} radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};
