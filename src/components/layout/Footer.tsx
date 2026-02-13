
import React from 'react';
import { useTranslation } from 'react-i18next';
import { APP_VERSION } from '../../config/constants';

export const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="mt-auto py-8 border-t border-slate-200 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-slate-400 text-xs flex items-center justify-center gap-2">
                    <span>© 2026 Roman Novobranets. {t('footer.copyright')}.</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{t('footer.version')} v{APP_VERSION}</span>
                </p>
            </div>
        </footer>
    );
};
