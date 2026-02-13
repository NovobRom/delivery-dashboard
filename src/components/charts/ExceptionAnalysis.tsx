
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GlassCard } from '@/components/common/GlassCard';
import { useTranslation } from 'react-i18next';
import type { CourierData } from '@/types/index';

interface Props {
    data: CourierData[];
}

export const ExceptionAnalysis: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();

    const chartData = React.useMemo(() => {
        const stats: Record<string, { date: string, noReason: number, sortKey: number }> = {};

        data.forEach(item => {
            if (!stats[item.dateStr]) {
                stats[item.dateStr] = {
                    date: item.dateStr.substring(0, 5),
                    noReason: 0,
                    sortKey: item.dateObj.getTime()
                };
            }
            stats[item.dateStr].noReason += item.noReason;
        });

        return Object.values(stats).sort((a, b) => a.sortKey - b.sortKey);
    }, [data]);

    const totalNoReason = chartData.reduce((acc, curr) => acc + curr.noReason, 0);
    const avgNoReason = chartData.length > 0 ? (totalNoReason / chartData.length).toFixed(1) : 0;
    const worstDay = chartData.length > 0 ? chartData.reduce((prev, current) => (prev.noReason > current.noReason) ? prev : current) : null;

    return (
        <GlassCard className="h-96 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('charts.exceptionAnalysis', 'Exceptions: "No Reason"')}</h3>

            <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex flex-col">
                    <span className="text-slate-500">{t('common.total', 'Total')}</span>
                    <span className="font-bold text-red-600">{totalNoReason}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-slate-500">{t('summary.avgPerDay', 'Avg / Day')}</span>
                    <span className="font-bold text-slate-800">{avgNoReason}</span>
                </div>
                {worstDay && (
                    <div className="flex flex-col">
                        <span className="text-slate-500">{t('summary.worstDay', 'Worst Day')}</span>
                        <span className="font-bold text-red-600">{worstDay.date} ({worstDay.noReason})</span>
                    </div>
                )}
            </div>

            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="noReason" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name={t('common.noReason', 'No Reason')} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};
