import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { ToastService } from '../../core/services/toast.service';
import { Department } from '../../models/department.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="employee-form-page p-3 p-md-4">
      
      <!-- Page Header & Back Button -->
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <a routerLink="/employees" class="text-secondary text-decoration-none small d-inline-flex align-items-center gap-1 mb-1">
            <i class="bi bi-arrow-left"></i> Back to Directory
          </a>
          <h2 class="fw-bold mb-0 text-dark">{{ isEditMode ? 'Edit Employee Profile' : 'Add New Employee' }}</h2>
          <p class="text-muted small mb-0">{{ isEditMode ? 'Update personnel records and assignment information.' : 'Fill in the details below to register a new employee.' }}</p>
        </div>
      </div>

      <!-- Form Card -->
      <div class="custom-card bg-white p-4 p-md-5">
        
        @if (isLoading) {
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-2">Loading employee details...</p>
          </div>
        } @else {
          <form [formGroup]="empForm" (ngSubmit)="onSubmit()">
            
            <h5 class="fw-bold text-dark border-bottom pb-2 mb-4 d-flex align-items-center gap-2">
              <i class="bi bi-person-lines-fill text-primary"></i> Personal Information
            </h5>

            <div class="row g-3 mb-4">
              
              <!-- Full Name -->
              <div class="col-12 col-md-6">
                <label class="form-label small fw-semibold text-secondary">Full Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" formControlName="fullName" placeholder="e.g. Alex Morgan"
                       [class.is-invalid]="f['fullName'].touched && f['fullName'].errors">
                @if (f['fullName'].touched && f['fullName'].errors) {
                  <div class="text-danger small mt-1">
                    @if (f['fullName'].errors['required']) { Full Name is required. }
                    @if (f['fullName'].errors['minlength']) { Must be at least 2 characters. }
                  </div>
                }
              </div>

              <!-- Email Address -->
              <div class="col-12 col-md-6">
                <label class="form-label small fw-semibold text-secondary">Email Address <span class="text-danger">*</span></label>
                <input type="email" class="form-control" formControlName="email" placeholder="e.g. alex.morgan@company.com"
                       [class.is-invalid]="f['email'].touched && f['email'].errors">
                @if (f['email'].touched && f['email'].errors) {
                  <div class="text-danger small mt-1">
                    @if (f['email'].errors['required']) { Email is required. }
                    @if (f['email'].errors['email']) { Please enter a valid email address. }
                  </div>
                }
              </div>

              <!-- Phone Number -->
              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold text-secondary">Phone Number <span class="text-danger">*</span></label>
                <input type="tel" class="form-control" formControlName="phoneNumber" placeholder="e.g. +1-555-0101"
                       [class.is-invalid]="f['phoneNumber'].touched && f['phoneNumber'].errors">
                @if (f['phoneNumber'].touched && f['phoneNumber'].errors) {
                  <div class="text-danger small mt-1">
                    @if (f['phoneNumber'].errors['required']) { Phone Number is required. }
                    @if (f['phoneNumber'].errors['pattern']) { Please enter a valid phone number. }
                  </div>
                }
              </div>

              <!-- Gender -->
              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold text-secondary">Gender <span class="text-danger">*</span></label>
                <select class="form-select" formControlName="gender" [class.is-invalid]="f['gender'].touched && f['gender'].errors">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <!-- Date of Birth -->
              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold text-secondary">Date of Birth <span class="text-danger">*</span></label>
                <input type="date" class="form-control" formControlName="dateOfBirth"
                       [class.is-invalid]="f['dateOfBirth'].touched && f['dateOfBirth'].errors">
                @if (f['dateOfBirth'].touched && f['dateOfBirth'].errors) {
                  <div class="text-danger small mt-1">
                    Date of Birth is required.
                  </div>
                }
              </div>

              <!-- Residential Address -->
              <div class="col-12">
                <label class="form-label small fw-semibold text-secondary">Residential Address <span class="text-danger">*</span></label>
                <textarea class="form-control" rows="2" formControlName="address" placeholder="Street address, City, State, ZIP..."
                          [class.is-invalid]="f['address'].touched && f['address'].errors"></textarea>
                @if (f['address'].touched && f['address'].errors) {
                  <div class="text-danger small mt-1">
                    Address is required (min 5 characters).
                  </div>
                }
              </div>

            </div>

            <h5 class="fw-bold text-dark border-bottom pb-2 mb-4 d-flex align-items-center gap-2">
              <i class="bi bi-briefcase-fill text-primary"></i> Employment & Organizational Details
            </h5>

            <div class="row g-3 mb-4">
              
              <!-- Department Selection -->
              <div class="col-12 col-md-6">
                <label class="form-label small fw-semibold text-secondary">Department <span class="text-danger">*</span></label>
                <select class="form-select" formControlName="departmentId" [class.is-invalid]="f['departmentId'].touched && f['departmentId'].errors">
                  <option [ngValue]="null" disabled>Select Department</option>
                  @for (dept of departments; track dept.departmentId) {
                    <option [ngValue]="dept.departmentId">{{ dept.departmentName }}</option>
                  }
                </select>
                @if (f['departmentId'].touched && f['departmentId'].errors) {
                  <div class="text-danger small mt-1">
                    Please select a department.
                  </div>
                }
              </div>

              <!-- Designation -->
              <div class="col-12 col-md-6">
                <label class="form-label small fw-semibold text-secondary">Designation / Role <span class="text-danger">*</span></label>
                <input type="text" class="form-control" formControlName="designation" placeholder="e.g. Lead Software Engineer"
                       [class.is-invalid]="f['designation'].touched && f['designation'].errors">
                @if (f['designation'].touched && f['designation'].errors) {
                  <div class="text-danger small mt-1">
                    Designation is required.
                  </div>
                }
              </div>

              <!-- Annual Salary -->
              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold text-secondary">Annual Salary ($) <span class="text-danger">*</span></label>
                <div class="input-group">
                  <span class="input-group-text bg-light">$</span>
                  <input type="number" class="form-control" formControlName="salary" placeholder="e.g. 75000" min="1000"
                         [class.is-invalid]="f['salary'].touched && f['salary'].errors">
                </div>
                @if (f['salary'].touched && f['salary'].errors) {
                  <div class="text-danger small mt-1">
                    @if (f['salary'].errors['required']) { Salary is required. }
                    @if (f['salary'].errors['min']) { Salary must be at least $1,000. }
                  </div>
                }
              </div>

              <!-- Joining Date -->
              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold text-secondary">Joining Date <span class="text-danger">*</span></label>
                <input type="date" class="form-control" formControlName="joiningDate"
                       [class.is-invalid]="f['joiningDate'].touched && f['joiningDate'].errors">
                @if (f['joiningDate'].touched && f['joiningDate'].errors) {
                  <div class="text-danger small mt-1">
                    Joining Date is required.
                  </div>
                }
              </div>

              <!-- Employment Status -->
              <div class="col-12 col-md-4">
                <label class="form-label small fw-semibold text-secondary">Status <span class="text-danger">*</span></label>
                <select class="form-select" formControlName="status">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

            </div>

            <!-- Form Action Buttons -->
            <div class="d-flex justify-content-end gap-3 pt-3 border-top">
              <a routerLink="/employees" class="btn btn-outline-secondary px-4">
                Cancel
              </a>
              <button type="submit" class="btn btn-primary px-4 shadow-sm" [disabled]="empForm.invalid || isSubmitting">
                @if (isSubmitting) {
                  <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                  Saving...
                } @else {
                  <i class="bi bi-check2-circle me-1"></i>
                  {{ isEditMode ? 'Update Employee' : 'Save Employee' }}
                }
              </button>
            </div>

          </form>
        }

      </div>
    </div>
  `
})
export class EmployeeFormComponent implements OnInit {
  empForm!: FormGroup;
  isEditMode: boolean = false;
  employeeId: number | null = null;
  departments: Department[] = [];
  isLoading: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.employeeId = +idParam;
      this.loadEmployeeData(this.employeeId);
    }
  }

  initForm(): void {
    this.empForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/)]],
      gender: ['Male', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      departmentId: [null, [Validators.required]],
      designation: ['', [Validators.required, Validators.maxLength(100)]],
      salary: [null, [Validators.required, Validators.min(1000)]],
      joiningDate: [new Date().toISOString().substring(0, 10), [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
      status: ['Active', [Validators.required]]
    });
  }

  get f() {
    return this.empForm.controls;
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        if (res.success) {
          this.departments = res.data;
        }
      }
    });
  }

  loadEmployeeData(id: number): void {
    this.isLoading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          const emp = res.data;
          this.empForm.patchValue({
            fullName: emp.fullName,
            email: emp.email,
            phoneNumber: emp.phoneNumber,
            gender: emp.gender,
            dateOfBirth: emp.dateOfBirth.substring(0, 10),
            departmentId: emp.departmentId,
            designation: emp.designation,
            salary: emp.salary,
            joiningDate: emp.joiningDate.substring(0, 10),
            address: emp.address,
            status: emp.status
          });
        }
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/employees']);
      }
    });
  }

  onSubmit(): void {
    if (this.empForm.invalid) {
      this.empForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.empForm.value;

    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, formValue).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res.success) {
            this.toastService.success(`Employee ${res.data.fullName} updated successfully!`);
            this.router.navigate(['/employees']);
          }
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.employeeService.createEmployee(formValue).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res.success) {
            this.toastService.success(`Employee ${res.data.fullName} registered successfully!`);
            this.router.navigate(['/employees']);
          }
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
}
