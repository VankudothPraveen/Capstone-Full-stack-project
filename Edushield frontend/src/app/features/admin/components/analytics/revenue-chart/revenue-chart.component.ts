import { Component, Input, OnChanges, ViewChild, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  template: `
    <div class="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 h-full overflow-hidden relative group">
      <div class="flex items-center justify-between mb-4 relative z-10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-1.5 h-1.5 bg-primary-maroon rounded-full"></div>
            <p class="text-[10px] text-primary-maroon font-bold uppercase tracking-wider">Revenue Stream</p>
          </div>
          <h3 class="text-lg font-black text-dark-gray tracking-tight">Premium Collections</h3>
        </div>
      </div>

      <div class="h-[180px] relative z-10">
        <canvas baseChart
          [data]="lineChartData"
          [options]="lineChartOptions"
          [type]="lineChartType">
        </canvas>
      </div>

      <div *ngIf="!data || data.length === 0" class="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[2px] z-20">
        <p class="text-[10px] font-bold text-medium-gray uppercase tracking-widest">Awaiting Records...</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
  `]
})
export class RevenueChartComponent implements OnChanges {
  @Input() data: any[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private cdr = inject(ChangeDetectorRef);

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Revenue (₹)',
        backgroundColor: 'rgba(126, 21, 70, 0.05)',
        borderColor: '#7E1546',
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#7E1546',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleFont: { size: 12, weight: 'bold' },
        padding: 10,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.02)' },
        ticks: { font: { size: 10, weight: 700 }, color: '#9CA3AF' }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, weight: 700 }, color: '#9CA3AF' }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  ngOnChanges() {
    if (this.data && this.data.length > 0) {
      let labels = this.data.map(d => d.month);
      let values = this.data.map(d => d.amount);
      if (labels.length === 1) {
        labels = ['Day 1', ...labels];
        values = [0, ...values];
      }
      this.lineChartData.labels = labels;
      this.lineChartData.datasets[0].data = values;
      setTimeout(() => this.chart?.update(), 100);
    }
  }
}
