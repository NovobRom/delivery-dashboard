
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GlassCard } from '@/components/common/GlassCard';
import { useTranslation } from 'react-i18next';
import { calculateDeliveryMethodBreakdown } from '@/utils/calculations';
import type { CourierData } from '@/types/index';

interface Props {
    data: CourierData[];
}

const COLORS = ['#6366f1', '#a855f7', '#ef4444']; // Indigo, Purple, Red

export const DeliveryMethodChart: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();
    const breakdown = calculateDeliveryMethodBreakdown(data);

    const chartData = [
        { name: t('charts.hand', 'Hand'), value: breakdown.hand },
        { name: t('charts.safeplace', 'SafePlace'), value: breakdown.safeplace },
        { name: t('charts.undelivered', 'Undelivered'), value: breakdown.undelivered },
    ];

    const total = breakdown.total;

    return (
        <GlassCard className="h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('charts.deliveryMethods', 'Delivery Methods')}</h3>
            <div className="flex-grow relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                    <p className="text-2xl font-bold text-slate-800">{total.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{t('common.total', 'Total')}</p>
                </div>
            </div>
        </GlassCard>
    );
};
