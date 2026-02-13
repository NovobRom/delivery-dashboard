
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StatCard } from '@/components/common/StatCard';
import { Icons } from '@/components/common/Icons';
import {
    calculateTotalStats,
    calculateDeliveryMethodBreakdown,
    calculateActiveCouriers
} from '@/utils/calculations';
import type { CourierData } from '@/types/index';

interface KPISectionProps {
    data: CourierData[];
}

export const KPISection: React.FC<KPISectionProps> = ({ data }) => {
    const { t } = useTranslation();
    const stats = calculateTotalStats(data);
    const breakdown = calculateDeliveryMethodBreakdown(data);
    const activeCouriers = calculateActiveCouriers(data);

    // Existing metrics
    const delivered = stats.delivered;
    const loaded = stats.loaded;
    const noReason = stats.noReason;
    const avgRate = stats.avgRate;

    // New metrics
    const handPercent = delivered > 0 ? ((breakdown.hand / delivered) * 100).toFixed(1) : '0';
    const safePlacePercent = delivered > 0 ? ((breakdown.safeplace / delivered) * 100).toFixed(1) : '0';

    // Addresses Coverage (delivered / addresses)
    // We need total addresses. calculateTotalStats doesn't return it yet, let's sum it here or update util.
    // Let's sum it here for now.
    const totalAddresses = data.reduce((acc, curr) => acc + curr.addresses, 0);
    const addressCoverage = totalAddresses > 0 ? (delivered / totalAddresses).toFixed(2) : '0';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Existing Cards */}
            <StatCard
                title={t('kpi.loaded', 'Loaded')}
                value={loaded.toLocaleString()}
                icon={Icons.Package}
                colorClass="bg-blue-500 text-blue-500"
            />
            <StatCard
                title={t('kpi.delivered', 'Delivered')}
                value={delivered.toLocaleString()}
                icon={Icons.CheckCircle}
                colorClass="bg-green-500 text-green-500"
            />
            <StatCard
                title={t('kpi.noReason', 'No Reason')}
                value={noReason.toLocaleString()}
                icon={Icons.AlertTriangle}
                colorClass="bg-red-500 text-red-500"
            />
            <StatCard
                title={t('kpi.successRate', 'Success Rate')}
                value={`${avgRate}%`}
                icon={Icons.Activity}
                colorClass={parseFloat(avgRate) >= 95 ? "bg-emerald-500 text-emerald-500" : "bg-amber-500 text-amber-500"}
            />

            {/* New Cards */}
            <StatCard
                title={t('kpi.handDelivery', 'Hand Delivery %')}
                value={`${handPercent}%`}
                subtext={`${breakdown.hand.toLocaleString()} ${t('common.orders', 'orders')}`}
                icon={Icons.Check}
                colorClass="bg-indigo-500 text-indigo-500"
            />
            <StatCard
                title={t('kpi.safePlace', 'SafePlace %')}
                value={`${safePlacePercent}%`}
                subtext={`${breakdown.safeplace.toLocaleString()} ${t('common.orders', 'orders')}`}
                icon={Icons.MapPin}
                colorClass="bg-purple-500 text-purple-500"
            />
            <StatCard
                title={t('kpi.addressCoverage', 'Addr. Coverage')}
                value={addressCoverage}
                subtext={t('kpi.parcelsPerAddress', 'Parcels per address')}
                icon={Icons.Globe}
                colorClass="bg-cyan-500 text-cyan-500"
            />
            <StatCard
                title={t('kpi.activeCouriers', 'Active Couriers')}
                value={activeCouriers.toString()}
                icon={Icons.Package} // Or User icon if available, using Package for now or reuse existing
                colorClass="bg-orange-500 text-orange-500"
            />
        </div>
    );
};
