import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Papa from 'papaparse';
import { useSettingsStore, useDataStore } from '@/store';
import { MainLayout } from './components/layout/MainLayout';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { MappingModal } from './components/features/ImportWizard/MappingModal';
import { Toast } from './components/common/Toast';

const Dashboard = React.lazy(() => import('./components/features/Dashboard/Dashboard'));

function App() {
    const { i18n } = useTranslation();
    const { language } = useSettingsStore();
    const {
        importMappedData,
        deliveryRecords,
        error: dataError,
        isWizardOpen,
        openWizard,
        closeWizard,
        csvHeaders
    } = useDataStore();

    const [isDragging, setIsDragging] = React.useState(false);
    const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

    // Sync i18n with store
    React.useEffect(() => {
        i18n.changeLanguage(language);
    }, [language, i18n]);

    // Monitor import results
    React.useEffect(() => {
        if (dataError) {
            setToast({ message: dataError, type: 'error' });
        }
    }, [dataError]);

    // We can't easily detect "success" just by deliveryRecords change without a flag, 
    // but for this snippet, let's assume if it changes and is not empty, it's a new import.
    // A better way would be to have a 'successMessage' in store or use a transient flag.
    // For now, let's just show a generic success if needed or leave it to the user to trigger.
    // BUT the requirement says "Show how to handle... e.g. toast". 
    // I'll add a useEffect that tracks the previous length?
    // Let's simpler: modify handleImportConfirm to set a "processing" flag locally and watch it?
    // Actually, DataStore has `isLoading`.

    // Let's add a ref to track if we triggered an import
    const importTriggered = React.useRef(false);

    React.useEffect(() => {
        if (importTriggered.current && !useDataStore.getState().isLoading) {
            importTriggered.current = false;
            const state = useDataStore.getState();
            if (!state.error && state.deliveryRecords.length > 0) {
                setToast({ message: `Successfully imported ${state.deliveryRecords.length} records!`, type: 'success' });
            }
        }
    }, [deliveryRecords, dataError]); // This is tricky with store subscription, but let's try

    // Better: Wrap importMappedData
    // const wrappedImport = (file: string, mapping: Record<string, string>) => {
    //    importMappedData(file, mapping);
    //    importTriggered.current = true;
    // };

    const handleFileDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
            const text = await file.text();

            // Parse headers (first non-empty line)
            Papa.parse(text, {
                preview: 1,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data && results.data.length > 0) {
                        const headers = results.data[0] as string[];
                        openWizard(text, headers);
                    }
                }
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
    };

    const handleImportConfirm = (mapping: Record<string, string>) => {
        // We need the file text. Ideally, importMappedData should access it from store or we pass it?
        // Wait, importMappedData takes file string.
        // In Store: pendingFile is stored.
        // So importMappedData doesn't need file arg if it can read from store?
        // But the action signature is (file, mapping).
        // Let's modify importMappedData in store or pass it here. 
        // We have pendingFile in store, but useDataStore hook exposes it.
        const state = useDataStore.getState();
        if (state.pendingFile) {
            importMappedData(state.pendingFile, mapping);
            importTriggered.current = true;
            closeWizard();
            setToast({ message: 'Processing data...', type: 'info' });
        }
    };

    return (
        <ErrorBoundary>
            <div
                className="min-h-screen"
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                {/* Drag Overlay */}
                {isDragging && (
                    <div className="fixed inset-0 z-50 bg-indigo-500/10 backdrop-blur-sm border-4 border-indigo-500 border-dashed rounded-xl m-4 flex items-center justify-center pointer-events-none">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl">
                            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Drop CSV to Import</p>
                        </div>
                    </div>
                )}

                <MainLayout>
                    <Suspense fallback={<LoadingSkeleton />}>
                        <Dashboard />
                    </Suspense>
                </MainLayout>

                <MappingModal
                    isOpen={isWizardOpen}
                    onClose={closeWizard}
                    csvHeaders={csvHeaders}
                    onConfirm={handleImportConfirm}
                />

                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
}

export default App;
