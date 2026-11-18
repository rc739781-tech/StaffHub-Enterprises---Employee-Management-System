import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { ToastService } from '../../core/services/toast.service';
import { Employee } from '../../models/employee.model';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmModalComponent],
  template: `
    <div class="employee-details-page p-3 p-md-4">
      
      <!-- Page Header & Back Button -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <a routerLink="/employees" class="text-secondary text-decoration-none small d-inline-flex align-items-center gap-1 mb-1">
            <i class="bi bi-arrow-left"></i> Back to Directory
          </a>
          <h2 class="fw-bold mb-0 text-dark">Employee Dossier</h2>
          <p class="text-muted small mb-0">Detailed organizational profile, employment terms, and contact record.</p>
        </div>
        
        @if (employee) {
          <div class="d-flex gap-2">
            <a [routerLink]="['/employees/edit', employee.employeeId]" class="btn btn-outline-primary d-flex align-items-center gap-2">
              <i class="bi bi-pencil-square"></i> Edit Profile
            </a>
            <button type="button" class="btn btn-outline-danger d-flex align-items-center gap-2" (click)="isDeleteModalOpen = true">
              <i class="bi bi-trash3"></i> Delete
            </button>
          </div>
        }
      </div>

      <!-- Loading State -->
      @if (isLoading) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="text-muted mt-2">Loading employee record...</p>
        </div>
      } @else if (employee) {
        
        <div class="row g-4">
          
          <!-- Left Column: Profile Card -->
          <div class="col-12 col-lg-4">
            <div class="custom-card bg-white p-4 text-center">
              <div class="avatar-circle avatar-lg mx-auto mb-3">
                {{ employee.fullName.charAt(0) }}
              </div>
              <h4 class="fw-bold text-dark mb-1">{{ employee.fullName }}</h4>
              <p class="text-muted mb-2">{{ employee.designation }}</p>
              
              <div class="mb-3">
                <span class="badge badge-dept me-1">{{ employee.departmentName }}</span>
                @if (employee.status === 'Active') {
                  <span class="badge badge-active"><i class="bi bi-circle-fill" style="font-size: 0.45rem;"></i> Active</span>
                } @else {
                  <span class="badge badge-inactive"><i class="bi bi-circle-fill" style="font-size: 0.45rem;"></i> Inactive</span>
                }
              </div>

              <div class="border-top pt-3 mt-3 text-start">
                <div class="d-flex justify-content-between py-2 border-bottom">
                  <span class="text-muted small">Employee ID</span>
                  <span class="fw-semibold small text-dark">#{{ employee.employeeId }}</span>
                </div>
                <div class="d-flex justify-content-between py-2 border-bottom">
                  <span class="text-muted small">Gender</span>
                  <span class="fw-semibold small text-dark">{{ employee.gender }}</span>
                </div>
                <div class="d-flex justify-content-between py-2 border-bottom">
                  <span class="text-muted small">Date of Birth</span>
                  <span class="fw-semibold small text-dark">{{ employee.dateOfBirth | date:'mediumDate' }}</span>
                </div>
                <div class="d-flex justify-content-between py-2">
                  <span class="text-muted small">Record Created</span>
                  <span class="fw-semibold small text-dark">{{ employee.createdAt | date:'mediumDate' }}</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Right Column: Employment & Contact Details -->
          <div class="col-12 col-lg-8">
            
            <!-- Contact Information Card -->
            <div class="custom-card bg-white p-4 mb-4">
              <h5 class="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                <i class="bi bi-telephone-fill text-primary"></i> Contact Information
              </h5>
              
              <div class="row g-3">
                <div class="col-12 col-sm-6">
                  <span class="text-muted small d-block">Work Email Address</span>
                  <a [href]="'mailto:' + employee.email" class="fw-semibold text-primary text-decoration-none">
                    {{ employee.email }}
                  </a>
                </div>
                <div class="col-12 col-sm-6">
                  <span class="text-muted small d-block">Phone Number</span>
                  <a [href]="'tel:' + employee.phoneNumber" class="fw-semibold text-dark text-decoration-none">
                    {{ employee.phoneNumber }}
                  </a>
                </div>
                <div class="col-12">
                  <span class="text-muted small d-block">Residential Address</span>
                  <div class="fw-semibold text-dark mt-1">
                    {{ employee.address }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Employment & Compensation Card -->
            <div class="custom-card bg-white p-4">
              <h5 class="fw-bold text-dark border-bottom pb-2 mb-3 d-flex align-items-center gap-2">
                <i class="bi bi-award-fill text-primary"></i> Employment & Financial Details
              </h5>

              <div class="row g-3">
                <div class="col-12 col-sm-6">
                  <span class="text-muted small d-block">Assigned Department</span>
                  <div class="fw-bold text-dark fs-6">{{ employee.departmentName }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <span class="text-muted small d-block">Designation</span>
                  <div class="fw-bold text-dark fs-6">{{ employee.designation }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <span class="text-muted small d-block">Annual Salary</span>
                  <div class="fw-bold text-success fs-5">{{ employee.salary | currency:'USD':'symbol':'1.0-0' }}</div>
                </div>
                <div class="col-12 col-sm-6">
                  <span class="text-muted small d-block">Joining Date</span>
                  <div class="fw-bold text-dark fs-6">{{ employee.joiningDate | date:'fullDate' }}</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      }

      <!-- Delete Modal -->
      <app-confirm-modal
        [isOpen]="isDeleteModalOpen"
        title="Delete Employee"
        [message]="'Are you sure you want to permanently delete ' + (employee?.fullName || 'this record') + '?'"
        (confirmed)="confirmDelete()"
        (cancelled)="isDeleteModalOpen = false">
      </app-confirm-modal>

    </div>
  `
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | null = null;
  isLoading: boolean = true;
  isDeleteModalOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(+id);
    }
  }

  loadEmployee(id: number): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.employee = res.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/employees']);
      }
    });
  }

  confirmDelete(): void {
    if (!this.employee) return;

    this.employeeService.deleteEmployee(this.employee.employeeId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(`Employee ${this.employee?.fullName} has been deleted.`);
          this.router.navigate(['/employees']);
        }
      }
    });
  }
}
