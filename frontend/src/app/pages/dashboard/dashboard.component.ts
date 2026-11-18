import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page p-3 p-md-4">
      
      <!-- Page Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 class="fw-bold mb-1 text-dark">Executive Dashboard</h2>
          <p class="text-muted small mb-0">Live organization workforce metrics and department analytics.</p>
        </div>
        <div class="d-flex gap-2">
          <a routerLink="/employees/new" class="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
            <i class="bi bi-person-plus-fill"></i> Add New Employee
          </a>
          <a routerLink="/departments" class="btn btn-outline-primary d-flex align-items-center gap-2">
            <i class="bi bi-building"></i> Manage Depts
          </a>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="text-muted mt-2">Loading organizational metrics...</p>
        </div>
      } @else if (stats) {
        
        <!-- Key Metrics Cards Row -->
        <div class="row g-3 g-md-4 mb-4">
          
          <!-- Total Employees -->
          <div class="col-12 col-sm-6 col-xl-3">
            <div class="stat-card">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <span class="text-muted small text-uppercase fw-semibold">Total Staff</span>
                  <h3 class="fw-bold my-1 text-dark">{{ stats.totalEmployees }}</h3>
                  <span class="badge bg-primary-subtle text-primary fw-medium small">
                    <i class="bi bi-people me-1"></i> Full Workforce
                  </span>
                </div>
                <div class="stat-icon-wrapper bg-primary-subtle text-primary">
                  <i class="bi bi-people-fill"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Active Employees -->
          <div class="col-12 col-sm-6 col-xl-3">
            <div class="stat-card">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <span class="text-muted small text-uppercase fw-semibold">Active Members</span>
                  <h3 class="fw-bold my-1 text-success">{{ stats.activeEmployees }}</h3>
                  <span class="badge bg-success-subtle text-success fw-medium small">
                    <i class="bi bi-check-circle me-1"></i> Active Status
                  </span>
                </div>
                <div class="stat-icon-wrapper bg-success-subtle text-success">
                  <i class="bi bi-person-check-fill"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Inactive Employees -->
          <div class="col-12 col-sm-6 col-xl-3">
            <div class="stat-card">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <span class="text-muted small text-uppercase fw-semibold">Inactive Staff</span>
                  <h3 class="fw-bold my-1 text-warning">{{ stats.inactiveEmployees }}</h3>
                  <span class="badge bg-warning-subtle text-warning fw-medium small">
                    <i class="bi bi-pause-circle me-1"></i> On Leave / Offboard
                  </span>
                </div>
                <div class="stat-icon-wrapper bg-warning-subtle text-warning">
                  <i class="bi bi-person-dash-fill"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Total Departments -->
          <div class="col-12 col-sm-6 col-xl-3">
            <div class="stat-card">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <span class="text-muted small text-uppercase fw-semibold">Active Units</span>
                  <h3 class="fw-bold my-1 text-info">{{ stats.totalDepartments }}</h3>
                  <span class="badge bg-info-subtle text-info fw-medium small">
                    <i class="bi bi-diagram-3 me-1"></i> Departments
                  </span>
                </div>
                <div class="stat-icon-wrapper bg-info-subtle text-info">
                  <i class="bi bi-buildings-fill"></i>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Payroll & Average Salary Row -->
        <div class="row g-3 g-md-4 mb-4">
          <div class="col-12 col-md-6">
            <div class="custom-card p-4 h-100 bg-white d-flex align-items-center justify-content-between">
              <div>
                <span class="text-muted small fw-semibold text-uppercase">Total Monthly Payroll</span>
                <h4 class="fw-bold text-dark mt-1 mb-0">{{ stats.totalMonthlyPayroll | currency:'USD':'symbol':'1.0-0' }}</h4>
                <small class="text-muted">Calculated across all active staff</small>
              </div>
              <div class="p-3 bg-emerald-light rounded-4 text-success fs-3">
                <i class="bi bi-cash-stack"></i>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="custom-card p-4 h-100 bg-white d-flex align-items-center justify-content-between">
              <div>
                <span class="text-muted small fw-semibold text-uppercase">Average Salary</span>
                <h4 class="fw-bold text-dark mt-1 mb-0">{{ stats.averageSalary | currency:'USD':'symbol':'1.0-0' }}</h4>
                <small class="text-muted">Per active employee</small>
              </div>
              <div class="p-3 bg-primary-light rounded-4 text-primary fs-3">
                <i class="bi bi-graph-up-arrow"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Distribution & Recent Employees Grid -->
        <div class="row g-4">
          
          <!-- Department Breakdown -->
          <div class="col-12 col-lg-5">
            <div class="custom-card h-100 p-4 bg-white">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold text-dark mb-0">Department Distribution</h5>
                <a routerLink="/departments" class="small text-primary text-decoration-none fw-semibold">View All</a>
              </div>
              <p class="text-muted small mb-4">Proportion of active staff allocated across business units.</p>

              <div class="d-flex flex-column gap-3">
                @for (dept of stats.departmentBreakdown; track dept.departmentId) {
                  <div>
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="fw-semibold small text-dark">{{ dept.departmentName }}</span>
                      <span class="badge bg-light text-secondary border">{{ dept.employeeCount }} staff ({{ dept.percentage }}%)</span>
                    </div>
                    <div class="progress" style="height: 8px; border-radius: 4px;">
                      <div class="progress-bar bg-primary" role="progressbar" [style.width.%]="dept.percentage"></div>
                    </div>
                  </div>
                }
              </div>

              <!-- Gender Diversity -->
              <div class="mt-4 pt-3 border-top">
                <h6 class="fw-bold text-dark mb-3">Workforce Diversity</h6>
                <div class="d-flex gap-2">
                  @for (gen of stats.genderBreakdown; track gen.gender) {
                    <div class="flex-fill p-2 rounded-3 bg-light text-center">
                      <small class="text-muted d-block">{{ gen.gender }}</small>
                      <strong class="text-dark">{{ gen.count }} ({{ gen.percentage }}%)</strong>
                    </div>
                  }
                </div>
              </div>

            </div>
          </div>

          <!-- Recently Joined Employees -->
          <div class="col-12 col-lg-7">
            <div class="custom-card h-100 p-4 bg-white">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold text-dark mb-0">Recent Employees</h5>
                <a routerLink="/employees" class="small text-primary text-decoration-none fw-semibold">Browse Directory &rarr;</a>
              </div>
              <p class="text-muted small mb-3">Latest members enrolled into the organization.</p>

              <div class="table-responsive">
                <table class="table custom-table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (emp of stats.recentEmployees; track emp.employeeId) {
                      <tr>
                        <td>
                          <div class="d-flex align-items-center gap-2">
                            <div class="avatar-circle" style="width: 34px; height: 34px; font-size: 0.82rem;">
                              {{ emp.fullName.charAt(0) }}
                            </div>
                            <div>
                              <a [routerLink]="['/employees', emp.employeeId]" class="fw-bold text-dark text-decoration-none small">
                                {{ emp.fullName }}
                              </a>
                              <div class="text-muted" style="font-size: 0.75rem;">ID: #{{ emp.employeeId }}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="badge badge-dept small">{{ emp.departmentName }}</span>
                        </td>
                        <td class="small text-secondary">{{ emp.designation }}</td>
                        <td>
                          @if (emp.status === 'Active') {
                            <span class="badge badge-active small"><i class="bi bi-dot"></i> Active</span>
                          } @else {
                            <span class="badge badge-inactive small"><i class="bi bi-dot"></i> Inactive</span>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>

      }
    </div>
  `,
  styles: [`
    .bg-emerald-light {
      background-color: #ecfdf5;
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardSummary | null = null;
  isLoading: boolean = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
