import { Component, OnInit, inject, signal } from '@angular/core';
import { User } from '../../../../core/models/interfaces';
import { AdminUserService } from '../../services/admin-user.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user-management', standalone: true, imports: [DatePipe, FormsModule],
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {
  private userApi = inject(AdminUserService);
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  toast = inject(ToastService);

  users = signal<User[]>([]);
  isLoading = signal(true);
  currentUserId = this.auth.currentUser()?.userId;

  // Create user modal
  showCreateModal = signal(false);
  creating = signal(false);
  newUser = { name: '', email: '', phone: '', password: '' };
  roleOptions = ['USER', 'UNDERWRITER', 'CLAIMS_OFFICER', 'ADMIN'];
  selectedRole = 'USER';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userApi.getAllUsers(0, 500).subscribe({
      next: (data) => {
        this.users.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.error(err.message);
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal() {
    this.newUser = { name: '', email: '', phone: '', password: '' };
    this.selectedRole = 'USER';
    this.showCreateModal.set(true);
  }

  createUser() {
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      this.toast.error('Name, email and password are required');
      return;
    }
    this.creating.set(true);
    const body = { ...this.newUser, role: this.selectedRole };
    this.http.post<any>(`${environment.apiBase}/auth/register`, body).subscribe({
      next: () => {
        this.toast.success('User created successfully!');
        this.showCreateModal.set(false);
        this.creating.set(false);
        this.loadUsers();
      },
      error: (err) => {
        this.toast.error(err?.error?.message || err?.message || 'Failed to create user');
        this.creating.set(false);
      }
    });
  }

  deleteUser(id: number, e: Event) {
    e.stopPropagation();
    if (confirm('Are you absolutely sure you want to delete this user? This action cannot be undone.')) {
      this.userApi.deleteUser(id).subscribe({
        next: () => {
          this.toast.success('User deleted successfully');
          this.loadUsers();
        },
        error: (err) => this.toast.error(err.message)
      });
    }
  }
}
