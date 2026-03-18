import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    templateUrl: './toast.component.html'
})
export class ToastComponent {
    toastService = inject(ToastService);

    getClass(type: string): string {
        const map: Record<string, string> = {
            success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
            error: 'bg-red-50 border-red-200 text-red-800',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            info: 'bg-blue-50 border-blue-200 text-blue-800',
        };
        return map[type] || map['info'];
    }

    getIcon(type: string): string {
        const map: Record<string, string> = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
        return map[type] || 'ℹ️';
    }
}
