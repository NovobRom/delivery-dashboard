
import React from 'react';
import { useTranslation } from 'react-i18next';
import { APP_VERSION } from '../../config/constants';

export const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="mt-auto border-t border-slate-200/60 dark:border-gray-700/60 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Copyright */}
                    <p className="text-sm text-slate-500 dark:text-gray-400 font-medium tracking-wide">
                        © {new Date().getFullYear()}{' '}
                        <span className="text-slate-700 dark:text-gray-200 font-semibold">
                            Roman Novobranets
                        </span>
                        <span className="mx-1.5 text-slate-300 dark:text-gray-600">—</span>
                        {t('footer.copyright')}
                    </p>

                    {/* Version badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/70 dark:bg-gray-800 text-slate-500 dark:text-gray-400 ring-1 ring-slate-300/50 dark:ring-gray-700/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {t('footer.version')} {APP_VERSION}
                    </span>
                </div>
            </div>
        </footer>
    );
};
