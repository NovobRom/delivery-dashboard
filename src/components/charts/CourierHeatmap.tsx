
import React, { useMemo } from 'react';
import { GlassCard } from '@/components/common/GlassCard';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';
import type { CourierData } from '@/types/index';

interface Props {
    data: CourierData[];
}

export const CourierHeatmap: React.FC<Props> = ({ data }) => {
    const { t } = useTranslation();

    // Prepare data: Unique dates (cols) and Unique couriers (rows)
    const { dates, couriers, matrix } = useMemo(() => {
        const uniqueDates = Array.from(new Set(data.map(d => d.dateStr))).sort((a, b) => {
            // Assuming DD.MM.YYYY
            const [da, ma, ya] = a.split('.').map(Number);
            const [db, mb, yb] = b.split('.').map(Number);
            return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
        });

        const uniqueCouriers = Array.from(new Set(data.map(d => d.courier))).sort();

        const map = new Map<string, number>();
        data.forEach(d => {
            map.set(`${d.courier}-${d.dateStr}`, d.successRate);
        });

        return { dates: uniqueDates, couriers: uniqueCouriers, matrix: map };
    }, [data]);

    const getColor = (rate: number | undefined) => {
        if (rate === undefined) return 'bg-slate-100'; // No data
        if (rate >= 95) return 'bg-emerald-500';
        if (rate >= 85) return 'bg-green-400';
        if (rate >= 70) return 'bg-yellow-400';
        if (rate >= 50) return 'bg-orange-400';
        return 'bg-red-500';
    };

    return (
        <GlassCard className="flex flex-col overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('charts.courierProductivity', 'Courier Productivity Heatmap')}</h3>
            <div className="overflow-x-auto flex-grow">
                <table className="min-w-full text-xs">
                    <thead>
                        <tr>
                            <th className="sticky left-0 bg-white z-10 p-2 text-left font-medium text-slate-500 border-b">{t('common.courier', 'Courier')}</th>
                            {dates.map(date => (
                                <th key={date} className="p-2 font-medium text-slate-500 border-b whitespace-nowrap transform -rotate-45 origin-bottom-left h-24 align-bottom">
                                    {date.substring(0, 5)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {couriers.map(courier => (
                            <tr key={courier} className="hover:bg-slate-50">
                                <td className="sticky left-0 bg-white z-10 p-2 font-medium text-slate-700 border-r">{courier}</td>
                                {dates.map(date => {
                                    const rate = matrix.get(`${courier}-${date}`);
                                    return (
                                        <td key={`${courier}-${date}`} className="p-1 border text-center">
                                            <div
                                                className={`w-8 h-8 mx-auto rounded flex items-center justify-center text-[10px] text-white font-bold transition-all hover:scale-110 cursor-alias ${getColor(rate)}`}
                                                data-tooltip-id="heatmap-tooltip"
                                                data-tooltip-content={`${courier} (${date}): ${rate?.toFixed(1)}%`}
                                            >
                                                {rate ? Math.round(rate) : '-'}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Tooltip id="heatmap-tooltip" />
        </GlassCard>
    );
};
