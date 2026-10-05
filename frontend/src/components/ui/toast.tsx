import React from 'react';
import { create } from 'zustand';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const duration = toast.duration || 4000;

    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().showToast({ type: 'success', title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().showToast({ type: 'error', title, description }),
  info: (title: string, description?: string) =>
    useToastStore.getState().showToast({ type: 'info', title, description }),
};

export const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="assertive"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none sm:bottom-6 sm:right-6"
    >
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto p-4 rounded-card border shadow-xl flex items-start gap-3 bg-surface transition-all animate-in slide-in-from-bottom-3 duration-300',
              isSuccess && 'border-success/40 bg-surface',
              isError && 'border-danger/40 bg-surface',
              !isSuccess && !isError && 'border-primary/30 bg-surface'
            )}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="h-5 w-5 text-success" />}
              {isError && <AlertCircle className="h-5 w-5 text-danger" />}
              {!isSuccess && !isError && <Info className="h-5 w-5 text-primary" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-extrabold text-text-primary tracking-tight">{t.title}</h4>
              {t.description && (
                <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">{t.description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-text-muted hover:text-text-primary shrink-0 p-1"
              aria-label="Close notification"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
