import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex items-center justify-center p-6 bg-background">
          <div className="max-w-md w-full bg-surface border border-border rounded-card p-8 shadow-card text-center space-y-5">
            <div className="mx-auto w-16 h-16 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-primary tracking-tight">
                Something went wrong
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                An unexpected error occurred while rendering this view. Our team has been notified.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-background border border-border rounded-input text-left overflow-auto max-h-32">
                <p className="text-[11px] font-mono text-danger font-semibold break-words">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="accent"
                size="default"
                onClick={this.handleReload}
                className="w-full sm:w-auto font-bold text-xs"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" /> Reload Page
              </Button>
              <Button
                variant="outline"
                size="default"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto font-bold text-xs"
              >
                <Home className="h-4 w-4 mr-1.5" /> Back to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
