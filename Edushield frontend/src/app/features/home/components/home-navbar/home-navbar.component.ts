import { Component, HostListener, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-navbar.component.html',
})
export class HomeNavbarComponent {
  isScrolled = signal(false);
  menuOpen = signal(false);

  navLinks = [
    { label: 'Home',             fragment: 'hero',     href: '/home' },
    { label: 'Services',         fragment: 'services', href: '/home' },
    { label: 'Coverage Options', fragment: 'coverage', href: '/home' },
    { label: 'Get Quote',        fragment: 'quote',    href: '/home' },
    { label: 'Contact',          fragment: 'footer',   href: '/home' },
  ];

  constructor(private router: Router) {}

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  scrollTo(fragment: string) {
    this.menuOpen.set(false);
    const el = document.getElementById(fragment);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  goLogin()    { this.router.navigate(['/auth/login']); }
  goRegister() { this.router.navigate(['/auth/register']); }
}
