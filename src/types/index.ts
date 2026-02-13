// Core data types
export interface CourierData {
    id: number;
    dateStr: string;
    dateObj: Date;
    courier: string;
    unit: string;
    addresses: number;
    loaded: number;
    delivered: number;
    hand: number;
    safeplace: number;
    undelivered: number;
    noReason: number;
    successRate: number;
}

export interface RegionalStats {
    region: string;
    successRate: number;
    volume: number;
}

export interface HeatmapCell {
    courier: string;
    date: string;
    rate: number;
}

export interface DeliveryMethodBreakdown {
    hand: number;
    safeplace: number;
    undelivered: number;
    total: number;
}

export interface SummaryStatistics {
    medianRate: number;
    bestDay: { date: string; rate: number } | null;
    worstDay: { date: string; rate: number } | null;
    totalRows: number;
    totalDays: number;
    uniqueCouriers: number;
    dateRange: { start: string; end: string } | null;
}

export interface ParseResult {
    data: CourierData[];
    error: string | null;
}

export interface CourierStats {
    name: string;
    delivered: number;
    loaded: number;
    addresses: number;
    noReason: number;
    rate: string;
    density: string;
}

export interface ChartDataPoint {
    date: string;
    sortKey: number | string;
    avgRate: number;
}

export interface TotalStats {
    loaded: number;
    delivered: number;
    avgRate: string;
    noReason: number;
}

// Filter types
export type DateRangeType = 'all' | 'this_month' | 'last_month' | 'this_week' | 'last_7' | 'custom';
export type AggregationMode = 'day' | 'week' | 'month';

export interface CustomDateRange {
    start: string;
    end: string;
}

export interface DateFilterOption {
    id: DateRangeType;
    labelKey: string;
}

// Store types
export interface DataState {
    rawData: string;
    fullData: CourierData[];
    error: string | null;
    isLoading: boolean;
    setRawData: (data: string) => void;
}

export interface FiltersState {
    selectedUnits: string[];
    selectedCouriers: string[];
    dateRange: DateRangeType;
    customDateRange: CustomDateRange;
    aggMode: AggregationMode;
    setSelectedUnits: (units: string[]) => void;
    setSelectedCouriers: (couriers: string[]) => void;
    setDateRange: (range: DateRangeType) => void;
    setCustomDateRange: (range: CustomDateRange) => void;
    setAggMode: (mode: AggregationMode) => void;
    resetFilters: () => void;
}

export interface SettingsState {
    language: 'en' | 'uk';
    setLanguage: (lang: 'en' | 'uk') => void;
}

// Component prop types
export interface StatCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    icon: React.ComponentType<IconProps>;
    colorClass: string;
    trend?: number;
}

export interface IconProps {
    size?: number;
    className?: string;
}

export interface MultiSelectProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    label: string;
    icon?: React.ComponentType<IconProps>;
}

export interface DateFilterProps {
    value: DateRangeType;
    onChange: (value: DateRangeType) => void;
    customRange: CustomDateRange;
    onCustomChange: (range: CustomDateRange) => void;
}

export interface FilterButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
}

export interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

export interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        name: string;
    }>;
    label?: string;
    unit?: string;
}
