import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ChildService } from '../../services/child.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Child } from '../../../../core/models/interfaces';

@Component({
    selector: 'app-child-list',
    standalone: true,
    imports: [RouterLink, DatePipe, FormsModule],
    templateUrl: './child-list.component.html'
})
export class ChildListComponent implements OnInit {
    auth = inject(AuthService);
    private childApi = inject(ChildService);
    toast = inject(ToastService);

    children = signal<Child[]>([]);
    searchQuery = signal('');

    filteredChildren = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        return this.children().filter(c => 
            !query || 
            c.childName?.toLowerCase().includes(query) || 
            c.schoolName?.toLowerCase().includes(query)
        );
    });

    ngOnInit() {
        this.loadChildren();
    }

    loadChildren() {
        this.childApi.getMyChildren(0, 50).subscribe({
            next: res => {
                const children = Array.isArray(res) ? res : (res.data || []);
                this.children.set(children);
            },
            error: () => {
                this.children.set([]);
            }
        });
    }

    getAge(dob: Date): number {
        const today = new Date();
        const d = new Date(dob);
        return today.getFullYear() - d.getFullYear();
    }

    deleteChild(id: number) {
        if (!confirm('Are you sure you want to remove this child?')) return;
        this.childApi.delete(id).subscribe({
            next: () => {
                this.children.update(list => list.filter(c => c.childId !== id));
                this.toast.success('Child removed successfully');
            },
            error: err => this.toast.error(err.message || 'Failed to delete child')
        });
    }
}
