import { Component, inject, signal, computed, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PolicyService } from '../../services/policy.service';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Policy } from '../../../../core/models/interfaces';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-policy-calculator',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe],
  templateUrl: './policy-calculator.component.html'
})
export class PolicyCalculatorComponent implements OnInit, AfterViewInit {
  private policyApi = inject(PolicyService);
  @ViewChild('projChart') projChartRef!: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;
  allPolicies = signal<Policy[]>([]);

  selectedPolicyId: number | null = null;
  premiumSlider = 5000;
  durationSlider = 15;
  bonusSlider = 10;

  premium = signal(5000);
  duration = signal(15);
  bonusRate = signal(10);

  totalPaid = computed(() => this.premium() * 12 * this.duration());
  bonusAmount = computed(() => this.totalPaid() * this.bonusRate() / 100 * this.duration() / 10);
  maturityBenefit = computed(() => Math.round(this.totalPaid() + this.bonusAmount() + this.totalPaid() * 0.05));
  returnPct = computed(() => Math.round((this.maturityBenefit() / this.totalPaid() - 1) * 100));

  projections = computed(() => {
    const d = this.duration();
    const steps = [Math.round(d * 0.25), Math.round(d * 0.5), Math.round(d * 0.75), d];
    return steps.map(yr => ({
      year: yr,
      value: Math.round(this.premium() * 12 * yr + (this.premium() * 12 * yr) * this.bonusRate() / 100 * yr / 10)
    }));
  });

  ngOnInit() {
    this.policyApi.getAll(0, 100).subscribe({
      next: res => this.allPolicies.set(res.data),
      error: () => this.allPolicies.set([])
    });
  }

  recalculate() {
    this.premium.set(this.premiumSlider);
    this.duration.set(this.durationSlider);
    this.bonusRate.set(this.bonusSlider);
    this.updateChart();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initChart(), 200);
  }

  private initChart() {
    if (!this.projChartRef?.nativeElement) return;
    const labels = Array.from({ length: this.duration() }, (_, i) => `Yr ${i + 1}`);
    const data = labels.map((_, i) => {
      const yr = i + 1;
      return Math.round(this.premium() * 12 * yr + (this.premium() * 12 * yr) * this.bonusRate() / 100 * yr / 10);
    });
    this.chart = new Chart(this.projChartRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Projected Benefit (₹)', data, borderColor: '#8A0F3D', backgroundColor: 'rgba(138,15,61,0.1)', borderWidth: 2, fill: true, tension: 0.3 },
          { label: 'Total Paid (₹)', data: labels.map((_, i) => (i + 1) * this.premium() * 12), borderColor: '#D4AF37', borderDash: [5, 5], borderWidth: 1.5, fill: false, tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { size: 10 } } } },
        scales: {
          x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { size: 10 } } },
          y: { ticks: { callback: (v: any) => '₹' + (v / 1000).toFixed(0) + 'K', font: { size: 10 } } }
        }
      }
    });
  }

  private updateChart() {
    if (!this.chart) { this.initChart(); return; }
    this.chart.destroy();
    this.initChart();
  }
}
