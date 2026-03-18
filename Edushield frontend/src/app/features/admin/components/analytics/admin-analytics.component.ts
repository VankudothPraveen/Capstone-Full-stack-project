import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AdminAnalyticsService } from '../../services/admin-analytics.service';
import { RevenueChartComponent } from './revenue-chart/revenue-chart.component';
import { PolicyDistributionComponent } from './policy-distribution/policy-distribution.component';
import { ClaimsAnalyticsComponent } from './claims-analytics/claims-analytics.component';
import { UserGrowthChartComponent } from './user-growth-chart/user-growth-chart.component';
import { LucideAngularModule, Users, FileText, Activity, CreditCard, Clock } from 'lucide-angular';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [
    CommonModule, 
    DecimalPipe, 
    RevenueChartComponent,
    PolicyDistributionComponent,
    ClaimsAnalyticsComponent,
    UserGrowthChartComponent
  ],
  templateUrl: './admin-analytics.component.html'
})
export class AdminAnalyticsComponent implements OnInit {
  private analyticsApi = inject(AdminAnalyticsService);

  overview = signal<any>(null);
  revenue = signal<any>(null);
  claims = signal<any>(null);
  apps = signal<any>(null);
  policies = signal<any>([]);
  userGrowth = signal<any>([]);
  loading = signal(true);

  ngOnInit() {
    this.refreshAll();
  }

  refreshAll() {
    this.loading.set(true);
    console.log('AdminAnalytics: Fetching all data...');
    
    this.analyticsApi.getOverview().subscribe(data => {
      console.log('AdminAnalytics: Overview data:', data);
      this.overview.set(data);
    });
    
    this.analyticsApi.getRevenue().subscribe(data => {
      console.log('AdminAnalytics: Revenue data:', data);
      this.revenue.set(data);
    });
    
    this.analyticsApi.getClaims().subscribe(data => {
      console.log('AdminAnalytics: Claims data:', data);
      this.claims.set(data);
    });
    
    this.analyticsApi.getApplications().subscribe(data => {
      console.log('AdminAnalytics: Application data:', data);
      this.apps.set(data);
    });
    
    this.analyticsApi.getPolicies().subscribe(data => {
      console.log('AdminAnalytics: Policy distribution data:', data);
      this.policies.set(data?.distribution || []);
    });
    
    this.analyticsApi.getUsers().subscribe(data => {
      console.log('AdminAnalytics: User growth data:', data);
      this.userGrowth.set(data?.growth || []);
      this.loading.set(false);
    });
  }
}
