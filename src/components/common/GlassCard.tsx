import type { GlassCardProps } from '@types/index';

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false }) => (
    <div className={`glass-panel rounded-2xl transition-all duration-300 hover:shadow-lg ${noPadding ? '' : 'p-6'} ${className}`}>
        {children}
    </div>
);
