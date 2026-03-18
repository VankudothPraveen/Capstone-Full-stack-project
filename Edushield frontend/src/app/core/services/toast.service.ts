import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts = signal<Toast[]>([]);
    private id = 0;

    show(message: string, type: Toast['type'] = 'info', duration = 3500) {
        const toast: Toast = { id: ++this.id, type, message };
        this.toasts.update(t => [...t, toast]);
        setTimeout(() => this.remove(toast.id), duration);
    }

    success(message: string) { this.show(message, 'success'); }
    error(message: string) { this.show(message, 'error'); }
    warning(message: string) { this.show(message, 'warning'); }
    info(message: string) { this.show(message, 'info'); }

    remove(id: number) { this.toasts.update(t => t.filter(x => x.id !== id)); }
}
