import { Component, Input, OnChanges, ViewChild, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-claims-analytics',
  standalone: true,
  imports: [BaseChartDirective, DecimalPipe, CommonModule],
  template: `
    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 h-full overflow-hidden relative group">
      <div class="flex justify-between items-center mb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            <p class="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Claims Analysis</p>
          </div>
          <h3 class="text-xl font-black text-dark-gray tracking-tight">Settlement Logic</h3>
        </div>
        <div class="text-right">
          <span class="text-[10px] font-black text-medium-gray uppercase tracking-tighter">Yield</span>
          <p class="text-lg font-black text-emerald-600 leading-none">{{approvalRate | number:'1.0-1'}}%</p>
        </div>
      </div>

      <div class="h-[180px] relative z-10 w-full font-sans">
        <canvas baseChart
          [data]="barChartData"
          [options]="barChartOptions"
          [type]="barChartType">
        </canvas>
      </div>

       <div *ngIf="!data" class="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px] z-20">
        <div class="text-center">
          <p class="text-[10px] font-black text-medium-gray uppercase tracking-widest">No Claims Records Found</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
  `]
})
export class ClaimsAnalyticsComponent implements OnChanges {
  @Input() data: any = null;
  @Input() approvalRate: number = 0;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    console.log('ClaimsAnalytics: Initialized Visual Nodes');
  }

  public barChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Policy Claims',
        backgroundColor: [
          '#10B981', // Emerald
          '#F43F5E', // Rose
          '#F59E0B', // Amber
          '#6366F1'  // Indigo
        ],
        borderRadius: 10,
        barThickness: 24,
        maxBarThickness: 32
      }
    ],
    labels: ['Approved', 'Rejected', 'Pending', 'Total']
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 0, bottom: 0 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111111',
        titleFont: { size: 12, weight: 'bold' },
        padding: 12,
        cornerRadius: 12,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.02)', drawTicks: false },
        border: { display: false },
        ticks: { font: { size: 10, weight: 700 }, color: '#9CA3AF' }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { size: 10, weight: 700 }, color: '#4B5563' }
      }
    }
  };

  public barChartType: ChartType = 'bar';

  ngOnChanges() {
    if (this.data) {
      console.log('ClaimsAnalytics: Dataset Synchronized', this.data);
      this.barChartData.datasets[0].data = [
        this.data.approvedClaims || 0,
        this.data.rejectedClaims || 0,
        this.data.pendingClaims || 0,
        this.data.totalClaims || 0
      ];
      
      setTimeout(() => {
        if (this.chart) {
          this.chart.update();
          this.cdr.markForCheck();
        }
      }, 150);
    }
  }
}
