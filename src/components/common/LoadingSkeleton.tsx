
import React from 'react';

export const LoadingSkeleton: React.FC = () => {
    return (
        <div className="w-full space-y-8 animate-pulse">
            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
                ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-2 h-96 bg-slate-200 rounded-2xl"></div>
                <div className="h-96 bg-slate-200 rounded-2xl"></div>
            </div>

            <div className="h-64 bg-slate-200 rounded-2xl"></div>
        </div>
    );
};
