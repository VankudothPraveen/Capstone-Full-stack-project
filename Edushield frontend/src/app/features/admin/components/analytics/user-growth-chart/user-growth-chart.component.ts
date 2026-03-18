import { Component, Input, OnChanges, ViewChild, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-user-growth-chart',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  template: `
    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 h-full overflow-hidden relative group">
      <div class="flex items-center justify-between mb-6 relative z-10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div>
            <p class="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Market Acquisition</p>
          </div>
          <h3 class="text-xl font-black text-dark-gray tracking-tight">Growth Velocity</h3>
        </div>
        <div class="text-right">
             <div class="px-3 py-1 bg-indigo-50 rounded-lg text-[10px] font-black text-indigo-600 border border-indigo-100">
               Apex Growth: {{ maxGrowth }} Units
             </div>
        </div>
      </div>

      <div class="h-[180px] relative z-10 w-full">
        <canvas baseChart
          [data]="growthChartData"
          [options]="growthChartOptions"
          [type]="growthChartType">
        </canvas>
      </div>

       <div *ngIf="!data || data.length === 0" class="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px] z-20">
        <div class="text-center">
          <p class="text-[10px] font-black text-medium-gray uppercase tracking-widest">Compiling Acquisition Metrics...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
  `]
})
export class UserGrowthChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private cdr = inject(ChangeDetectorRef);
  maxGrowth = 0;

  constructor() {
    console.log('UserGrowth: Initialized Dynamic Pipeline');
  }

  public growthChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Qualified Leads',
        backgroundColor: 'rgba(99, 102, 241, 0.08)',
        borderColor: '#6366F1',
        borderWidth: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#6366F1',
        pointBorderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.45
      }
    ],
    labels: []
  };

  public growthChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 5, bottom: 5 } },
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
        ticks: { font: { size: 10, weight: 700 }, color: '#9CA3AF', padding: 10 }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { font: { size: 10, weight: 700 }, color: '#9CA3AF', padding: 10 }
      }
    }
  };

  public growthChartType: ChartType = 'line';

  ngOnChanges() {
    console.log('UserGrowth: Processing Payload', this.data);
    if (this.data && this.data.length > 0) {
      let labels = this.data.map(d => d.month);
      let values = this.data.map(d => d.count);

      // Force line rendering if only one data point exists
      if (labels.length === 1) {
        labels = ['T-Minus', ...labels];
        values = [0, ...values];
      }

      this.growthChartData.labels = labels;
      this.growthChartData.datasets[0].data = values;
      this.maxGrowth = Math.max(...this.data.map(d => d.count));
      
      setTimeout(() => {
        if (this.chart) {
          this.chart.update();
          this.cdr.markForCheck();
        }
      }, 150);
    }
  }
}
