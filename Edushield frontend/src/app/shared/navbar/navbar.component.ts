import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';
import { UpperCasePipe, DatePipe } from '@angular/common';
import { NotificationService } from '../../features/notification/services/notification.service';
import { OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [UpperCasePipe, DatePipe],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  auth = inject(AuthService);
  router = inject(Router);
  notifService = inject(NotificationService);
  el = inject(ElementRef);
  
  menuOpen = signal(false);
  notifOpen = signal(false);
  private pollingInterval: any;

  ngOnInit() {
    this.notifService.loadNotifications();
    this.pollingInterval = setInterval(() => {
      this.notifService.loadNotifications();
    }, 30000); // Poll every 30 seconds
  }

  ngOnDestroy() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  }

  pageTitle() {
    const url = this.router.url;
    const map: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/children/list': 'My Children',
      '/policies/catalog': 'Policy Catalog',
      '/applications/my-applications': 'Applications',
      '/subscriptions/my-subscriptions': 'Subscriptions',
      '/payments/history': 'Payment History',
      '/claims/my-claims': 'My Claims',
      '/benefits/calculator': 'Benefits',
      '/profile': 'Profile',
      '/admin/dashboard': 'Admin Dashboard',
      '/admin/users': 'Users',
      '/admin/policies': 'Policies',
      '/admin/applications': 'Applications',
      '/admin/claims': 'Claims',
      '/admin/reports': 'Reports',
      '/admin/audit-logs': 'Audit Logs',
    };
    for (const key of Object.keys(map)) {
      if (url.startsWith(key)) return map[key];
    }
    return 'Home';
  }

  toggleSidebar() {
    // Emit to sidebar - using a simple approach via a shared service or DOM
    const sidebar = document.querySelector('app-sidebar') as any;
    if (sidebar?.__ngContext__) {
      // Toggle via sidebar component directly
    }
  }

  navigate(route: string) {
    this.menuOpen.set(false);
    this.router.navigate([route]);
  }

  async logout() {
    this.menuOpen.set(false);
    await this.auth.logout();
    this.router.navigate(['/auth/login']);
  }

  onNotificationClick(notif: any) {
    if (!notif.isRead) {
      this.notifService.markAsRead(notif.id);
    }
    if (notif.targetUrl) {
      this.router.navigateByUrl(notif.targetUrl);
    }
    this.notifOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.notifOpen.set(false);
      this.menuOpen.set(false);
    }
  }
}
