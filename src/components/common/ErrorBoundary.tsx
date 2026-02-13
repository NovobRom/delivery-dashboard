
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-2xl border border-red-100 m-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <span className="text-3xl">⚠️</span>
                    </div>

                    <h2 className="text-2xl font-bold text-red-800 mb-2">Something went wrong</h2>
                    <p className="text-red-600 mb-6 max-w-md">
                        {this.state.error?.message || 'An unexpected error occurred.'}
                        <br />
                        <span className="text-sm opacity-80 mt-2 block">
                            (CSV file might be corrupted or has incorrect format)
                        </span>
                    </p>

                    <button
                        onClick={this.handleReset}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-red-200"
                    >
                        Try Again
                    </button>

                    <button
                        className="mt-4 text-sm text-red-500 hover:underline"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
