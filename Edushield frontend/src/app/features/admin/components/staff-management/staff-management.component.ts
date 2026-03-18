import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/models/interfaces';
import { AdminUserService, CreateStaffRequest } from '../../services/admin-user.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../features/auth/services/auth.service';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './staff-management.component.html'
})
export class StaffManagementComponent implements OnInit {
  private userApi = inject(AdminUserService);
  private auth = inject(AuthService);
  toast = inject(ToastService);

  users = signal<User[]>([]);
  isLoading = signal(true);
  currentUserId = this.auth.currentUser()?.userId;

  // Create staff modal
  showCreateModal = signal(false);
  creating = signal(false);
  
  newStaff: CreateStaffRequest = {
    name: '',
    email: '',
    password: '',
    role: 'UNDERWRITER'
  };

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.userApi.getAllUsers(0, 500).subscribe({
      next: (data) => {
        // Filter to show only staff (UNDERWRITER and CLAIMS_OFFICER)
        const staff = data.filter(u => 
          u.role === 'ROLE_UNDERWRITER' || u.role === 'UNDERWRITER' ||
          u.role === 'ROLE_CLAIMS_OFFICER' || u.role === 'CLAIMS_OFFICER'
        );
        this.users.set(staff);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.error(err.message);
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(role: 'UNDERWRITER' | 'CLAIMS_OFFICER') {
    this.newStaff = {
      name: '',
      email: '',
      password: '',
      role: role
    };
    this.showCreateModal.set(true);
  }

  createStaff() {
    if (!this.newStaff.name || !this.newStaff.email || !this.newStaff.password) {
      this.toast.error('All fields are required');
      return;
    }
    
    this.creating.set(true);
    this.userApi.createStaff(this.newStaff).subscribe({
      next: () => {
        this.toast.success(`${this.newStaff.role} account created successfully!`);
        this.showCreateModal.set(false);
        this.creating.set(false);
        this.loadUsers();
      },
      error: (err) => {
        this.toast.error(err.message);
        this.creating.set(false);
      }
    });
  }

  toggleStatus(user: User) {
    const newStatus = !user.isActive;
    this.userApi.updateUserStatus(user.userId, newStatus).subscribe({
      next: () => {
        this.toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
        this.loadUsers();
      },
      error: (err) => this.toast.error(err.message)
    });
  }
}
