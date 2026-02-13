import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore } from '@/store';
import { MainLayout } from './components/layout/MainLayout';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const Dashboard = React.lazy(() => import('./components/features/Dashboard/Dashboard'));

function App() {
    const { i18n } = useTranslation();
    const { language } = useSettingsStore();

    // Sync i18n with store
    React.useEffect(() => {
        i18n.changeLanguage(language);
    }, [language, i18n]);

    return (
        <ErrorBoundary>
            <MainLayout>
                <Suspense fallback={<LoadingSkeleton />}>
                    <Dashboard />
                </Suspense>
            </MainLayout>
        </ErrorBoundary>
    );
}

export default App;
