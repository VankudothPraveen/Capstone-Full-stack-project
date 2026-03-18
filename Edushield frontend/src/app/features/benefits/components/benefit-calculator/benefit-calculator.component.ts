import { Component, inject, signal, computed, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { MockDataService } from '../../../../core/services/mock-data.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-benefit-calculator',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './benefit-calculator.component.html'
})
export class BenefitCalculatorComponent implements AfterViewInit {
  mockData = inject(MockDataService);
  @ViewChild('projChart') projRef!: ElementRef;
  private chart: Chart | null = null;

  premiumVal = 5000;
  durationVal = 15;
  bonusVal = 10;

  premium = signal(5000);
  duration = signal(15);
  bonus = signal(10);
  selectedBenefit = signal('MATURITY');

  benefitTypes = [
    { type: 'MATURITY', icon: '🎓', label: 'Maturity' },
    { type: 'DEATH', icon: '💔', label: 'Death' },
    { type: 'SURRENDER', icon: '📤', label: 'Surrender' },
  ];

  totalPaid = computed(() => this.premium() * 12 * this.duration());
  bonusAmt = computed(() => Math.round(this.totalPaid() * this.bonus() / 100 * this.duration() / 10));
  maturityBenefit = computed(() => this.totalPaid() + this.bonusAmt() + Math.round(this.totalPaid() * 0.05));
  deathBenefit = computed(() => this.maturityBenefit() * 2.5);
  surrenderBenefit = computed(() => Math.round(this.totalPaid() * 0.75));

  currentBenefit = computed(() => {
    if (this.selectedBenefit() === 'DEATH') return this.deathBenefit();
    if (this.selectedBenefit() === 'SURRENDER') return this.surrenderBenefit();
    return this.maturityBenefit();
  });

  cagr = computed(() => {
    const pv = this.totalPaid(); const fv = this.maturityBenefit(); const n = this.duration();
    return ((Math.pow(fv / pv, 1 / n) - 1) * 100).toFixed(1);
  });

  projectionRows = computed(() => {
    return [5, 8, 10, 12, 15].filter(y => y <= this.duration()).map(yr => {
      const paid = this.premium() * 12 * yr;
      const bonus = Math.round(paid * this.bonus() / 100 * yr / 10);
      const loyalty = Math.round(paid * 0.02 * yr);
      return { year: yr, paid, bonus, loyalty, total: paid + bonus + loyalty };
    });
  });

  onPremiumChange(e: Event) { this.premiumVal = +(e.target as HTMLInputElement).value; this.premium.set(this.premiumVal); this.updateChart(); }
  onDurationChange(e: Event) { this.durationVal = +(e.target as HTMLInputElement).value; this.duration.set(this.durationVal); this.updateChart(); }
  onBonusChange(e: Event) { this.bonusVal = +(e.target as HTMLInputElement).value; this.bonus.set(this.bonusVal); this.updateChart(); }

  ngAfterViewInit() { setTimeout(() => this.initChart(), 200); }

  private initChart() {
    if (!this.projRef?.nativeElement) return;
    const ctx = this.projRef.nativeElement.getContext('2d');
    const labels = Array.from({ length: this.duration() }, (_, i) => 'Yr ' + (i + 1));

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, 'rgba(138, 15, 61, 0.15)');
    gradient.addColorStop(1, 'rgba(138, 15, 61, 0)');

    this.chart = new Chart(this.projRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Maturity Value (₹)',
            data: labels.map((_, i) => { const yr = i + 1; const p = this.premium() * 12 * yr; return p + Math.round(p * this.bonus() / 100 * yr / 10); }),
            borderColor: '#8A0F3D',
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#8A0F3D',
            pointHoverRadius: 6,
            pointHoverBackgroundColor: '#8A0F3D',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2
          },
          {
            label: 'Total Premium (₹)',
            data: labels.map((_, i) => (i + 1) * this.premium() * 12),
            borderColor: '#D4AF37',
            borderDash: [8, 4],
            borderWidth: 1.5,
            fill: false,
            tension: 0.4,
            pointRadius: 0
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { size: 11, weight: 600, family: "'Outfit', sans-serif" }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#333',
            bodyColor: '#666',
            bodyFont: { size: 12 },
            padding: 12,
            borderColor: '#eee',
            borderWidth: 1,
            displayColors: true,
            usePointStyle: true,
            callbacks: {
              label: (context: any) => ` ${context.dataset.label}: ₹${context.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,0,0,0.03)' },
            ticks: { maxTicksLimit: 8, font: { size: 10, family: "'Outfit', sans-serif" }, color: '#999' }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              callback: (v: any) => '₹' + (v / 1000).toFixed(0) + 'K',
              font: { size: 10, family: "'Outfit', sans-serif" },
              color: '#999',
              padding: 8
            }
          }
        }
      }
    });
  }

  private updateChart() { if (this.chart) { this.chart.destroy(); this.chart = null; } this.initChart(); }
}
