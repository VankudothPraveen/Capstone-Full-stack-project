import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastComponent],
    templateUrl: './layout.component.html'
})
export class LayoutComponent { }
