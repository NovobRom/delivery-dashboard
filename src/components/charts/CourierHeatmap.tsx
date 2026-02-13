
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

        // Store full data object instead of just rate
        const map = new Map<string, { rate: number; loaded: number; delivered: number }>();
        data.forEach(d => {
            map.set(`${d.courier}-${d.dateStr}`, {
                rate: d.successRate,
                loaded: d.loaded,
                delivered: d.delivered
            });
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
        <GlassCard className="flex flex-col overflow-visible">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">{t('charts.courierProductivity', 'Courier Productivity Heatmap')}</h3>
            <div className="overflow-x-auto flex-grow pb-4 custom-scrollbar">
                <table className="min-w-full text-xs border-separate border-spacing-0">
                    <thead>
                        <tr>
                            <th className="sticky left-0 bg-white z-20 p-2 text-left font-medium text-slate-500 border-b min-w-[150px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                {t('common.courier', 'Courier')}
                            </th>
                            {dates.map(date => (
                                <th key={date} className="p-2 font-medium text-slate-500 border-b align-bottom h-32 relative min-w-[40px]">
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transform -rotate-45 origin-bottom-left whitespace-nowrap text-xs">
                                        {date.substring(0, 5)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {couriers.map(courier => (
                            <tr key={courier} className="hover:bg-slate-50 group">
                                <td className="sticky left-0 bg-white z-20 p-2 font-medium text-slate-700 border-r border-b group-hover:bg-slate-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                    {courier}
                                </td>
                                {dates.map(date => {
                                    const cellData = matrix.get(`${courier}-${date}`);
                                    const rate = cellData?.rate;

                                    // Tooltip content
                                    const tooltipHtml = cellData
                                        ? `
                                            <div class="text-left">
                                                <div class="font-bold mb-1 border-b border-gray-600 pb-1">${courier} <span class="text-gray-400 font-normal">(${date})</span></div>
                                                <div class="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                                                    <span>Success Rate:</span> <span class="font-bold text-right">${rate?.toFixed(1)}%</span>
                                                    <span>Loaded:</span> <span class="font-bold text-right">${cellData.loaded}</span>
                                                    <span>Delivered:</span> <span class="font-bold text-right">${cellData.delivered}</span>
                                                    <span>Diff:</span> <span class="font-bold text-right ${cellData.loaded - cellData.delivered > 0 ? 'text-red-300' : 'text-green-300'}">${cellData.delivered - cellData.loaded}</span>
                                                </div>
                                            </div>
                                        `
                                        : '';

                                    return (
                                        <td key={`${courier}-${date}`} className="p-1 border-b border-r border-slate-100 text-center relative">
                                            <div
                                                className={`w-8 h-8 mx-auto rounded flex items-center justify-center text-[10px] text-white font-bold transition-all hover:scale-110 hover:shadow-lg cursor-help ${getColor(rate)}`}
                                                data-tooltip-id="heatmap-tooltip"
                                                data-tooltip-html={tooltipHtml}
                                                data-tooltip-place="top"
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
            <Tooltip
                id="heatmap-tooltip"
                className="z-50 !opacity-100 !bg-slate-800 !text-white !p-3 !rounded-lg !shadow-xl !max-w-xs"
                border="1px solid rgba(255,255,255,0.1)"
            />
        </GlassCard>
    );
};
