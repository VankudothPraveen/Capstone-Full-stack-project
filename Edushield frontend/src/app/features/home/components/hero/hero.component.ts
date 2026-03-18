import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeStatsService, HomeStats } from '../../services/home-stats.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
})
export class HeroComponent implements OnInit {
  private router = inject(Router);
  private statsService = inject(HomeStatsService);
  
  // Initialize with realistic default values
  stats = signal<HomeStats>({
    totalUsers: 5000,
    totalPolicies: 7,
    totalClaimsSettled: 2500000, // ₹25 Lakhs
    claimApprovalRate: 95
  });

  ngOnInit() {
    this.statsService.getStats().subscribe({
      next: data => this.stats.set(data),
      error: () => {} // Keep defaults on error
    });
  }

  formatNumber(num: number): string {
    if (num >= 10000000) return (num / 10000000).toFixed(1) + 'Cr';
    if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  }

  goQuote()  { document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' }); }
  goPlans()  { document.getElementById('coverage')?.scrollIntoView({ behavior: 'smooth' }); }
}
