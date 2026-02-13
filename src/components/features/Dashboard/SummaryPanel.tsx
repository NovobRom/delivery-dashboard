
import React from 'react';
import { GlassCard } from '@/components/common/GlassCard';
import { useTranslation } from 'react-i18next';
import { calculateSummaryStatistics } from '@/utils/calculations';
import type { CourierData } from '@/types/index';
import { format, parseISO } from 'date-fns';
import { uk, enGB } from 'date-fns/locale';

interface Props {
    data: CourierData[];
}

export const SummaryPanel: React.FC<Props> = ({ data }) => {
    const { t, i18n } = useTranslation();
    const stats = calculateSummaryStatistics(data);

    if (!stats.dateRange) return null;

    const locale = i18n.language === 'uk' ? uk : enGB;
    const dateFormat = 'dd MMM yyyy';

    const formatDate = (dateStr: string) => {
        try {
            return format(parseISO(dateStr), dateFormat, { locale });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <GlassCard className="bg-gradient-to-br from-indigo-600 to-violet-800 text-white">
            <h3 className="text-lg font-semibold mb-4 opacity-90">{t('summary.title', 'Period Summary')}</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <p className="text-xs opacity-60 mb-1">{t('summary.dateRange', 'Date Range')}</p>
                    <p className="font-medium text-sm">
                        {formatDate(stats.dateRange.start)} - {formatDate(stats.dateRange.end)}
                    </p>
                    <p className="text-xs opacity-50 mt-1">{stats.totalDays} {t('summary.totalDays', 'days Total')}</p>
                </div>

                <div>
                    <p className="text-xs opacity-60 mb-1">{t('summary.medianRate', 'Median Success Rate')}</p>
                    <p className="text-2xl font-bold">{stats.medianRate.toFixed(1)}%</p>
                    <p className="text-xs opacity-50 mt-1">{stats.totalRows} {t('summary.recordsAnalyzed', 'records analyzed')}</p>
                </div>

                <div>
                    <p className="text-xs opacity-60 mb-1">{t('summary.bestDay', 'Best Day')}</p>
                    <p className="font-bold">{stats.bestDay ? formatDate(stats.bestDay.date) : '-'}</p>
                    <p className="text-sm text-green-300">{stats.bestDay?.rate.toFixed(1)}%</p>
                </div>

                <div>
                    <p className="text-xs opacity-60 mb-1">{t('summary.worstDay', 'Worst Day')}</p>
                    <p className="font-bold">{stats.worstDay ? formatDate(stats.worstDay.date) : '-'}</p>
                    <p className="text-sm text-red-300">{stats.worstDay?.rate.toFixed(1)}%</p>
                </div>
            </div>
        </GlassCard>
    );
};
