import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

export interface RiskRequest {
  parentAge: number;
  occupation: string;
  annualIncome: number;
  coverageAmount: number;
  policyId: number;
}

export interface RiskResult {
  riskScore: number;
  riskCategory: string;
  calculatedPremium: number;
}

@Injectable({ providedIn: 'root' })
export class RiskEstimatorService {
  private base = `${environment.apiBase}/risk/calculate`;

  constructor(private http: HttpClient) {}

  calculate(req: RiskRequest): Observable<RiskResult> {
    return this.http.post<any>(this.base, req).pipe(
      map(res => {
        // Handle both wrapped ApiResponse and raw RiskCalculationResponse
        if (res.success && res.data) return res.data as RiskResult;
        if (res.riskScore !== undefined) return res as RiskResult;
        throw new Error(res.message || 'Unexpected response format');
      }),
      catchError(err => throwError(() => new Error(
        err?.error?.message || err?.error || err?.message || 'Risk calculation failed'
      )))
    );
  }

  // Risk info for display purposes
  getRiskCategoryColor(category: string): string {
    switch (category) {
      case 'LOW': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-700 bg-yellow-100';
      case 'HIGH': return 'text-orange-700 bg-orange-100';
      case 'VERY_HIGH': return 'text-red-700 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }

  getMultiplierForCategory(category: string): number {
    switch (category) {
      case 'LOW': return 1.0;
      case 'MEDIUM': return 1.2;
      case 'HIGH': return 1.5;
      case 'VERY_HIGH': return 2.0;
      default: return 1.0;
    }
  }

  readonly OCCUPATIONS = [
    // Low Risk
    'Teacher', 'Professor', 'Lecturer',
    'Software Engineer', 'IT Professional', 'Data Analyst', 'Web Developer',
    'Government Employee', 'Bank Employee', 'Clerk',
    // Professional
    'Doctor', 'Physician', 'Dentist', 'Nurse', 'Pharmacist',
    'Lawyer', 'Advocate', 'Chartered Accountant', 'Auditor',
    'Engineer', 'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer',
    'Architect', 'Designer', 'Consultant',
    // Medium Risk
    'Business Owner', 'Entrepreneur', 'Self-Employed',
    'Manager', 'Sales Manager', 'HR Manager',
    'Shopkeeper', 'Retailer', 'Trader',
    'Farmer', 'Agriculture', 'Chef', 'Cook',
    // Higher Risk
    'Driver', 'Truck Driver', 'Taxi Driver',
    'Mechanic', 'Electrician', 'Plumber',
    'Security Guard', 'Watchman',
    'Factory Worker', 'Laborer',
    'Construction Worker', 'Mason', 'Carpenter',
    'Miner', 'Mining Worker',
    // High Risk
    'Army', 'Soldier', 'Military',
    'Police Officer', 'Firefighter',
    'Pilot', 'Aircraft Pilot',
    'Sailor', 'Ship Crew',
  ];
}
