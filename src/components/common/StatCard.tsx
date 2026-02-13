
import React from 'react';
import type { StatCardProps } from '@/types/index';
import { GlassCard } from './GlassCard';
import { Icons } from './Icons';

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon: Icon, colorClass, trend }) => {
    return (
        <GlassCard className="transition-transform hover:scale-105">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-medium text-slate-500">{title}</h3>
                    <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
                    {subtext && <p className="mt-1 text-xs text-slate-400">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 opacity-80 shadow-md`}>
                    <Icon size={24} className={colorClass.replace("bg-", "text-")} />
                </div>
            </div>
            {trend !== undefined && (
                <div className={`mt-4 flex items-center text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend >= 0 ? <Icons.TrendingUp size={16} className="mr-1" /> : <Icons.ArrowDownRight size={16} className="mr-1" />}
                    <span>{Math.abs(trend)}% vs last period</span>
                </div>
            )}
        </GlassCard>
    );
};
