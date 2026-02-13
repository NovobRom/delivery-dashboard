export const APP_VERSION = 'v10.0';
export const AUTHOR = 'Roman Novobranets';
export const CURRENT_YEAR = new Date().getFullYear();

export const SUPPORTED_LANGUAGES = ['en', 'uk'] as const;
export const DEFAULT_LANGUAGE = 'en';

export const DATE_FILTER_OPTIONS = [
    { id: 'all' as const, labelKey: 'dateFilter.allTime' },
    { id: 'this_month' as const, labelKey: 'dateFilter.thisMonth' },
    { id: 'last_month' as const, labelKey: 'dateFilter.lastMonth' },
    { id: 'this_week' as const, labelKey: 'dateFilter.thisWeek' },
    { id: 'last_7' as const, labelKey: 'dateFilter.last7Days' },
    { id: 'custom' as const, labelKey: 'dateFilter.customRange' },
];

export const AGG_MODES: Array<'day' | 'week' | 'month'> = ['day', 'week', 'month'];

export const MONTH_NAMES = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const INITIAL_CSV = `№\tДата відомості\tПІБ кур'єра\tНомер авто\tПідрозділ відомості\tК-сть відомостей\tК-сть адрес\tК-сть завантажених ШК\tК-сть доставлених ШК на дату відомості\t"К-сть доставлених ШК на дату відомості ""В руки"""\t"К-сть доставлених ШК на дату відомості ""SafePlace"""\tК-сть недоставлених ШК на дату відомості\tК-сть недоставлених ШК з причиною\tК-сть недоставлених ШК без причини\tВідсоток доставлених ШК
1\t02.01.2026\tdinul.a\tNO9230Y\tRIGA 1\t1\t19\t20\t15\t15\t0\t5\t5\t0\t75.00%
2\t02.01.2026\tkravets.v\t210MJR\tTallinn DEPO\t1\t0\t0\t0\t0\t0\t0\t0\t0\t
3\t02.01.2026\tmaistrienko.m\tNO7938\tRIGA 1\t2\t20\t23\t18\t18\t0\t5\t0\t5\t78.26%
4\t02.01.2026\trozkov.a\tNFU582\tAdressDelivery-OWN-LT-Vilnius-01\t1\t20\t21\t15\t14\t1\t6\t3\t3\t71.43%
5\t06.02.2026\tshvets.a\t210MJR\tTALLINN 1\t3\t32\t32\t19\t19\t0\t13\t0\t13\t59.38%
6\t07.02.2026\tshvets.a\t210MJR\tTALLINN 1\t3\t42\t43\t34\t34\t0\t9\t1\t8\t79.07%
7\t09.02.2026\tchudzij.a\tMRR974\tAdressDelivery-OWN-LT-Vilnius-01\t1\t26\t28\t19\t19\t0\t9\t2\t7\t67.86%`;
