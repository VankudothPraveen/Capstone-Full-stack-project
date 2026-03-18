import { Component, Input, OnChanges, ViewChild, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-policy-distribution',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  template: `
    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 h-full overflow-hidden relative group">
      <div class="flex items-center justify-between mb-6 relative z-10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <p class="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Market Saturation</p>
          </div>
          <h3 class="text-xl font-black text-dark-gray tracking-tight">Policy Distribution</h3>
        </div>
      </div>

      <div class="h-[180px] flex items-center justify-center relative z-10 w-full">
        <canvas baseChart
          [data]="doughnutChartData"
          [options]="doughnutChartOptions"
          [type]="doughnutChartType">
        </canvas>
        <div *ngIf="data && data.length > 0" class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-20px]">
          <p class="text-[10px] font-black text-medium-gray uppercase tracking-widest opacity-50">Total</p>
          <p class="text-3xl font-black text-dark-gray leading-none mt-1">{{ totalApps }}</p>
          <p class="text-[8px] font-bold text-medium-gray uppercase mt-1">Applications</p>
        </div>
      </div>

      <div *ngIf="!data || data.length === 0" class="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px] z-20">
        <div class="text-center">
          <p class="text-[10px] font-black text-medium-gray uppercase tracking-widest">No Policy Data Available</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
  `]
})
export class PolicyDistributionComponent implements OnChanges {
  @Input() data: any[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private cdr = inject(ChangeDetectorRef);
  totalApps = 0;

  constructor() {
    console.log('PolicyDistribution: Initialized Asset Nodes');
  }

  public doughnutChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#D4AF37', // Gold
          '#6366F1', // Indigo
          '#10B981', // Emerald
          '#F43F5E', // Rose
          '#8B5CF6'  // Violet
        ],
        hoverOffset: 15,
        borderWidth: 3,
        borderColor: '#ffffff'
      }
    ],
    labels: []
  };

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    layout: { padding: { top: 0, bottom: 0 } },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { 
          font: { size: 9, weight: 700 }, 
          usePointStyle: true, 
          padding: 15,
          color: '#4B5563'
        }
      },
      tooltip: {
        backgroundColor: '#111111',
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        usePointStyle: true
      }
    }
  };

  public doughnutChartType: ChartType = 'doughnut';

  ngOnChanges() {
    console.log('PolicyDistribution: Reconciling Assets', this.data);
    if (this.data && this.data.length > 0) {
      this.doughnutChartData.labels = this.data.map(d => d.policyName);
      this.doughnutChartData.datasets[0].data = this.data.map(d => d.count);
      this.totalApps = this.data.reduce((acc, curr) => acc + curr.count, 0);
      
      setTimeout(() => {
        if (this.chart) {
          this.chart.update();
          this.cdr.markForCheck();
        }
      }, 150);
    }
  }
}
