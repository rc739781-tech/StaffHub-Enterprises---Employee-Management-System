import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentService } from '../../core/services/department.service';
import { ToastService } from '../../core/services/toast.service';
import { Department } from '../../models/department.model';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmModalComponent],
  template: `
    <div class="departments-page p-3 p-md-4">
      
      <!-- Page Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 class="fw-bold mb-1 text-dark">Department Management</h2>
          <p class="text-muted small mb-0">Define organizational units, view staffing allocation, and manage hierarchy.</p>
        </div>
        <button class="btn btn-primary d-flex align-items-center gap-2 shadow-sm" (click)="openCreateModal()">
          <i class="bi bi-plus-circle-fill"></i> Add Department
        </button>
      </div>

      <!-- Loading State -->
      @if (isLoading) {
        <div class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="text-muted mt-2">Loading departments...</p>
        </div>
      } @else {
        
        <!-- Department Grid Cards -->
        <div class="row g-4">
          @for (dept of departments; track dept.departmentId) {
            <div class="col-12 col-md-6 col-xl-4">
              <div class="custom-card bg-white p-4 h-100 d-flex flex-column justify-content-between">
                
                <div>
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="d-flex align-items-center gap-2">
                      <div class="p-2 rounded-3 bg-primary-subtle text-primary fs-5">
                        <i class="bi bi-building"></i>
                      </div>
                      <div>
                        <h5 class="fw-bold text-dark mb-0">{{ dept.departmentName }}</h5>
                        <span class="text-muted small">ID: #{{ dept.departmentId }}</span>
                      </div>
                    </div>
                    @if (dept.status === 'Active') {
                      <span class="badge badge-active small"><i class="bi bi-dot"></i> Active</span>
                    } @else {
                      <span class="badge badge-inactive small"><i class="bi bi-dot"></i> Inactive</span>
                    }
                  </div>

                  <p class="text-secondary small mt-3 mb-3">
                    {{ dept.description || 'No specific description provided for this business unit.' }}
                  </p>
                </div>

                <div class="border-top pt-3 mt-2 d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center gap-1 text-muted small">
                    <i class="bi bi-people-fill text-primary"></i>
                    <strong class="text-dark">{{ dept.employeeCount || 0 }}</strong> active staff
                  </div>

                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-light" (click)="openEditModal(dept)" title="Edit Department">
                      <i class="bi bi-pencil-square text-secondary"></i>
                    </button>
                    <button class="btn btn-light" (click)="openDeleteModal(dept)" title="Delete Department">
                      <i class="bi bi-trash3 text-danger"></i>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          }
        </div>

      }

      <!-- Add/Edit Department Modal -->
      @if (isDeptModalOpen) {
        <div class="modal-backdrop fade show"></div>
        <div class="modal fade show d-block" tabindex="-1" role="dialog">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
              <div class="modal-header bg-primary text-white border-0 py-3">
                <h5 class="modal-title d-flex align-items-center gap-2 mb-0">
                  <i class="bi bi-building-add"></i>
                  {{ isEditMode ? 'Edit Department' : 'Create New Department' }}
                </h5>
                <button type="button" class="btn-close btn-close-white" (click)="isDeptModalOpen = false"></button>
              </div>
              
              <form [formGroup]="deptForm" (ngSubmit)="saveDepartment()">
                <div class="modal-body py-4 px-4">
                  
                  <!-- Department Name -->
                  <div class="mb-3">
                    <label class="form-label small fw-semibold text-secondary">Department Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" formControlName="departmentName" placeholder="e.g. Artificial Intelligence Research"
                           [class.is-invalid]="f['departmentName'].touched && f['departmentName'].errors">
                    @if (f['departmentName'].touched && f['departmentName'].errors) {
                      <div class="text-danger small mt-1">Department Name is required (2-100 characters).</div>
                    }
                  </div>

                  <!-- Description -->
                  <div class="mb-3">
                    <label class="form-label small fw-semibold text-secondary">Description</label>
                    <textarea class="form-control" rows="3" formControlName="description" placeholder="Brief scope and objectives..."></textarea>
                  </div>

                  <!-- Status -->
                  <div class="mb-2">
                    <label class="form-label small fw-semibold text-secondary">Status</label>
                    <select class="form-select" formControlName="status">
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                </div>

                <div class="modal-footer bg-light border-0 px-4 py-3">
                  <button type="button" class="btn btn-secondary px-3" (click)="isDeptModalOpen = false">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary px-3 shadow-sm" [disabled]="deptForm.invalid || isSubmitting">
                    @if (isSubmitting) {
                      <span class="spinner-border spinner-border-sm me-1"></span> Saving...
                    } @else {
                      <i class="bi bi-check2 me-1"></i> Save
                    }
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      }

      <!-- Delete Confirmation Modal -->
      <app-confirm-modal
        [isOpen]="isDeleteModalOpen"
        title="Delete Department"
        [message]="'Are you sure you want to delete ' + (selectedDept?.departmentName || 'this department') + '?'"
        (confirmed)="confirmDelete()"
        (cancelled)="isDeleteModalOpen = false">
      </app-confirm-modal>

    </div>
  `
})
export class DepartmentListComponent implements OnInit {
  departments: Department[] = [];
  isLoading: boolean = false;
  isDeptModalOpen: boolean = false;
  isEditMode: boolean = false;
  editingDeptId: number | null = null;
  deptForm!: FormGroup;
  isSubmitting: boolean = false;

  isDeleteModalOpen: boolean = false;
  selectedDept: Department | null = null;

  constructor(
    private departmentService: DepartmentService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
  }

  initForm(): void {
    this.deptForm = this.fb.group({
      departmentName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      status: ['Active', [Validators.required]]
    });
  }

  get f() {
    return this.deptForm.controls;
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.departmentService.getDepartments().subscribe({
      next: (res) => {
        if (res.success) {
          this.departments = res.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingDeptId = null;
    this.deptForm.reset({
      departmentName: '',
      description: '',
      status: 'Active'
    });
    this.isDeptModalOpen = true;
  }

  openEditModal(dept: Department): void {
    this.isEditMode = true;
    this.editingDeptId = dept.departmentId;
    this.deptForm.patchValue({
      departmentName: dept.departmentName,
      description: dept.description,
      status: dept.status
    });
    this.isDeptModalOpen = true;
  }

  saveDepartment(): void {
    if (this.deptForm.invalid) {
      this.deptForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formValue = this.deptForm.value;

    if (this.isEditMode && this.editingDeptId) {
      this.departmentService.updateDepartment(this.editingDeptId, formValue).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res.success) {
            this.toastService.success(`Department ${res.data.departmentName} updated successfully!`);
            this.isDeptModalOpen = false;
            this.loadDepartments();
          }
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.departmentService.createDepartment(formValue).subscribe({
        next: (res) => {
          this.isSubmitting = false;
          if (res.success) {
            this.toastService.success(`Department ${res.data.departmentName} created successfully!`);
            this.isDeptModalOpen = false;
            this.loadDepartments();
          }
        },
        error: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  openDeleteModal(dept: Department): void {
    this.selectedDept = dept;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (!this.selectedDept) return;

    this.departmentService.deleteDepartment(this.selectedDept.departmentId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(`Department ${this.selectedDept?.departmentName} deleted successfully.`);
          this.isDeleteModalOpen = false;
          this.selectedDept = null;
          this.loadDepartments();
        }
      },
      error: () => {
        this.isDeleteModalOpen = false;
      }
    });
  }
}
