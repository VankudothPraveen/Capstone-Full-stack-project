import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

export interface Notification {
  id: number;
  userId: number;
  recipientRole: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  targetUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private apiUrl = `${environment.apiBase}/notifications`;

  notifications = signal<Notification[]>([]);
  unreadCount = signal(0);

  loadNotifications() {
    const user = this.auth.currentUser() as any;
    if (!user) return;

    const params: any = {};
    if (user.userId) params.userId = user.userId;
    if (user.role) params.role = user.role;

    this.http.get<Notification[]>(this.apiUrl, { params }).subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.unreadCount.set(data.filter(n => !n.isRead).length);
      }
    });
  }

  markAsRead(id: number) {
    this.http.put(`${this.apiUrl}/${id}/read`, {}).subscribe({
      next: () => {
        this.notifications.update(list => 
          list.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        this.unreadCount.update(c => Math.max(0, c - 1));
      }
    });
  }

  markAllAsRead() {
    const user = this.auth.currentUser() as any;
    if (!user) return;

    const params: any = {};
    if (user.userId) params.userId = user.userId;
    if (user.role) params.role = user.role;

    this.http.put(`${this.apiUrl}/read-all`, {}, { params }).subscribe({
      next: () => {
        this.notifications.update(list => 
          list.map(n => ({ ...n, isRead: true }))
        );
        this.unreadCount.set(0);
      }
    });
  }
}
