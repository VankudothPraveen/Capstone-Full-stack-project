import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-footer',
  standalone: true,
  templateUrl: './home-footer.component.html',
})
export class HomeFooterComponent {
  currentYear = new Date().getFullYear();

  company = [
    { label: 'About Us',    action: 'about'    },
    { label: 'Careers',     action: 'careers'  },
    { label: 'Blog',        action: 'blog'     },
    { label: 'Press',       action: 'press'    },
  ];

  services = [
    { label: 'Education Insurance', action: 'coverage' },
    { label: 'Premium Calculator',  action: 'quote'    },
    { label: 'Claim Assistance',    action: 'claims'   },
    { label: 'Plan Comparison',     action: 'coverage' },
  ];

  support = [
    { label: 'FAQ',          action: 'faq'     },
    { label: 'Help Center',  action: 'help'    },
    { label: 'Contact Us',   action: 'contact' },
    { label: 'Live Chat',    action: 'chat'    },
  ];

  legal = [
    { label: 'Privacy Policy',    action: 'privacy' },
    { label: 'Terms of Service',  action: 'terms'   },
    { label: 'Cookie Policy',     action: 'cookies' },
    { label: 'Disclaimer',        action: 'disclaimer' },
  ];

  constructor(private router: Router) {}

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
