import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { ToastService } from '../../core/services/toast.service';
import { Employee, EmployeeQueryParams } from '../../models/employee.model';
import { Department } from '../../models/department.model';
import { PagedResult } from '../../models/api-response.model';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmModalComponent],
  template: `
    <div class="employee-list-page p-3 p-md-4">
      
      <!-- Page Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 class="fw-bold mb-1 text-dark">Employee Directory</h2>
          <p class="text-muted small mb-0">Search, filter, view, and manage all organization personnel.</p>
        </div>
        <div class="d-flex gap-2">
          <a routerLink="/employees/new" class="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
            <i class="bi bi-person-plus-fill"></i> Add New Employee
          </a>
        </div>
      </div>

      <!-- Filter / Search Control Card -->
      <div class="custom-card p-4 mb-4 bg-white">
        <div class="row g-3 align-items-end">
          
          <!-- Search Bar -->
          <div class="col-12 col-md-4">
            <label class="form-label small fw-semibold text-secondary">Search Employees</label>
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0 text-muted">
                <i class="bi bi-search"></i>
              </span>
              <input type="text" class="form-control border-start-0 ps-0"
                     placeholder="Search by name, email, or ID..."
                     [(ngModel)]="queryParams.search"
                     (keyup.enter)="onSearch()">
            </div>
          </div>

          <!-- Department Filter -->
          <div class="col-6 col-md-3">
            <label class="form-label small fw-semibold text-secondary">Department</label>
            <select class="form-select" [(ngModel)]="queryParams.departmentId" (change)="onFilterChange()">
              <option [ngValue]="null">All Departments</option>
              @for (dept of departments; track dept.departmentId) {
                <option [ngValue]="dept.departmentId">{{ dept.departmentName }}</option>
              }
            </select>
          </div>

          <!-- Status Filter -->
          <div class="col-6 col-md-2">
            <label class="form-label small fw-semibold text-secondary">Status</label>
            <select class="form-select" [(ngModel)]="queryParams.status" (change)="onFilterChange()">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <!-- Action & Reset Buttons -->
          <div class="col-12 col-md-3 d-flex gap-2">
            <button class="btn btn-primary flex-fill d-flex align-items-center justify-content-center gap-1" (click)="onSearch()">
              <i class="bi bi-filter"></i> Apply
            </button>
            <button class="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-1" (click)="resetFilters()" title="Reset Filters">
              <i class="bi bi-arrow-counterclockwise"></i> Reset
            </button>
          </div>

        </div>

        <!-- Optional Stored Procedure toggle for demo purposes -->
        <div class="mt-3 pt-3 border-top d-flex align-items-center justify-content-between">
          <div class="form-check form-switch mb-0">
            <input class="form-check-input" type="checkbox" id="spToggle" [(ngModel)]="queryParams.useStoredProcedure" (change)="loadEmployees()">
            <label class="form-check-label small text-muted" for="spToggle">
              Use SQL Server Stored Procedure (<code>sp_GetEmployees</code>)
            </label>
          </div>
          <span class="small text-muted">Showing {{ pagedData.items.length }} of {{ pagedData.totalCount }} total employees</span>
        </div>
      </div>

      <!-- Employees Table Card -->
      <div class="custom-card bg-white overflow-hidden">
        
        @if (isLoading) {
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-2">Fetching employees...</p>
          </div>
        } @else if (pagedData.items.length === 0) {
          <div class="text-center py-5">
            <i class="bi bi-person-x fs-1 text-muted"></i>
            <h5 class="fw-bold mt-2 text-dark">No employees found</h5>
            <p class="text-muted small">Try adjusting your search terms or filters.</p>
            <button class="btn btn-outline-primary btn-sm" (click)="resetFilters()">Clear All Filters</button>
          </div>
        } @else {
          <div class="table-responsive">
            <table class="table custom-table table-hover mb-0">
              <thead>
                <tr>
                  <th (click)="changeSort('EmployeeId')" class="cursor-pointer" style="cursor: pointer;">
                    ID <i class="bi" [ngClass]="getSortIcon('EmployeeId')"></i>
                  </th>
                  <th (click)="changeSort('FullName')" class="cursor-pointer" style="cursor: pointer;">
                    Employee <i class="bi" [ngClass]="getSortIcon('FullName')"></i>
                  </th>
                  <th (click)="changeSort('Department')" class="cursor-pointer" style="cursor: pointer;">
                    Department <i class="bi" [ngClass]="getSortIcon('Department')"></i>
                  </th>
                  <th>Designation</th>
                  <th (click)="changeSort('Salary')" class="cursor-pointer" style="cursor: pointer;">
                    Salary <i class="bi" [ngClass]="getSortIcon('Salary')"></i>
                  </th>
                  <th (click)="changeSort('JoiningDate')" class="cursor-pointer" style="cursor: pointer;">
                    Joining Date <i class="bi" [ngClass]="getSortIcon('JoiningDate')"></i>
                  </th>
                  <th (click)="changeSort('Status')" class="cursor-pointer" style="cursor: pointer;">
                    Status <i class="bi" [ngClass]="getSortIcon('Status')"></i>
                  </th>
                  <th class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (emp of pagedData.items; track emp.employeeId) {
                  <tr>
                    <td class="fw-semibold text-secondary">#{{ emp.employeeId }}</td>
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <div class="avatar-circle" style="width: 36px; height: 36px; font-size: 0.85rem;">
                          {{ emp.fullName.charAt(0) }}
                        </div>
                        <div>
                          <a [routerLink]="['/employees', emp.employeeId]" class="fw-bold text-dark text-decoration-none">
                            {{ emp.fullName }}
                          </a>
                          <div class="text-muted" style="font-size: 0.78rem;">{{ emp.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-dept">{{ emp.departmentName }}</span>
                    </td>
                    <td class="text-secondary small">{{ emp.designation }}</td>
                    <td class="fw-semibold text-dark">{{ emp.salary | currency:'USD':'symbol':'1.0-0' }}</td>
                    <td class="text-secondary small">{{ emp.joiningDate | date:'mediumDate' }}</td>
                    <td>
                      @if (emp.status === 'Active') {
                        <span class="badge badge-active"><i class="bi bi-circle-fill" style="font-size: 0.45rem;"></i> Active</span>
                      } @else {
                        <span class="badge badge-inactive"><i class="bi bi-circle-fill" style="font-size: 0.45rem;"></i> Inactive</span>
                      }
                    </td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <a [routerLink]="['/employees', emp.employeeId]" class="btn btn-light" title="View Profile">
                          <i class="bi bi-eye text-primary"></i>
                        </a>
                        <a [routerLink]="['/employees/edit', emp.employeeId]" class="btn btn-light" title="Edit Employee">
                          <i class="bi bi-pencil-square text-secondary"></i>
                        </a>
                        <button type="button" class="btn btn-light" (click)="openDeleteModal(emp)" title="Delete Employee">
                          <i class="bi bi-trash3 text-danger"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border-top gap-3">
            <div class="d-flex align-items-center gap-2">
              <span class="small text-muted">Page Size:</span>
              <select class="form-select form-select-sm w-auto" [(ngModel)]="queryParams.pageSize" (change)="loadEmployees()">
                <option [ngValue]="5">5</option>
                <option [ngValue]="10">10</option>
                <option [ngValue]="25">25</option>
              </select>
            </div>

            <div class="d-flex align-items-center gap-2">
              <span class="small text-muted">
                Page {{ pagedData.pageNumber }} of {{ pagedData.totalPages || 1 }}
              </span>
              <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-secondary" [disabled]="!pagedData.hasPrevious" (click)="goToPage(pagedData.pageNumber - 1)">
                  <i class="bi bi-chevron-left"></i> Prev
                </button>
                <button class="btn btn-outline-secondary" [disabled]="!pagedData.hasNext" (click)="goToPage(pagedData.pageNumber + 1)">
                  Next <i class="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        }

      </div>

      <!-- Delete Confirmation Modal -->
      <app-confirm-modal
        [isOpen]="isDeleteModalOpen"
        title="Delete Employee Record"
        [message]="'Are you sure you want to permanently delete ' + (selectedEmployee?.fullName || 'this employee') + ' from the database?'"
        (confirmed)="confirmDelete()"
        (cancelled)="isDeleteModalOpen = false">
      </app-confirm-modal>

    </div>
  `
})
export class EmployeeListComponent implements OnInit {
  pagedData: PagedResult<Employee> = {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    hasPrevious: false,
    hasNext: false
  };

  departments: Department[] = [];
  isLoading: boolean = false;

  queryParams: EmployeeQueryParams = {
    search: '',
    departmentId: null,
    status: '',
    sortBy: 'EmployeeId',
    isDescending: true,
    pageNumber: 1,
    pageSize: 10,
    useStoredProcedure: false
  };

  isDeleteModalOpen: boolean = false;
  selectedEmployee: Employee | null = null;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
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

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getEmployees(this.queryParams).subscribe({
      next: (res) => {
        if (res.success) {
          this.pagedData = res.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    this.queryParams.pageNumber = 1;
    this.loadEmployees();
  }

  onFilterChange(): void {
    this.queryParams.pageNumber = 1;
    this.loadEmployees();
  }

  resetFilters(): void {
    this.queryParams = {
      search: '',
      departmentId: null,
      status: '',
      sortBy: 'EmployeeId',
      isDescending: true,
      pageNumber: 1,
      pageSize: 10,
      useStoredProcedure: false
    };
    this.loadEmployees();
  }

  changeSort(column: string): void {
    if (this.queryParams.sortBy === column) {
      this.queryParams.isDescending = !this.queryParams.isDescending;
    } else {
      this.queryParams.sortBy = column;
      this.queryParams.isDescending = false;
    }
    this.loadEmployees();
  }

  getSortIcon(column: string): string {
    if (this.queryParams.sortBy !== column) return 'bi-arrow-down-up text-muted';
    return this.queryParams.isDescending ? 'bi-sort-down text-primary' : 'bi-sort-up text-primary';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.pagedData.totalPages) {
      this.queryParams.pageNumber = page;
      this.loadEmployees();
    }
  }

  openDeleteModal(emp: Employee): void {
    this.selectedEmployee = emp;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (!this.selectedEmployee) return;

    this.employeeService.deleteEmployee(this.selectedEmployee.employeeId).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(`Employee ${this.selectedEmployee?.fullName} deleted successfully.`);
          this.isDeleteModalOpen = false;
          this.selectedEmployee = null;
          this.loadEmployees();
        }
      },
      error: (err) => {
        this.isDeleteModalOpen = false;
      }
    });
  }
}
