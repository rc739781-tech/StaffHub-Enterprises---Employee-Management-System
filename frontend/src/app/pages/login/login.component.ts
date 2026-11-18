import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-wrapper d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div class="login-card-container col-12 col-md-8 col-lg-5 col-xl-4">
        <div class="card border-0 shadow-xl rounded-4 overflow-hidden">
          
          <!-- Card Header -->
          <div class="login-header p-4 text-center text-white">
            <div class="brand-badge mb-3 mx-auto">
              <i class="bi bi-people-fill fs-2"></i>
            </div>
            <h3 class="fw-bold mb-1">Welcome Back</h3>
            <p class="text-white-50 small mb-0">Sign in to your Employee Portal account</p>
          </div>

          <!-- Card Body -->
          <div class="card-body p-4 p-sm-5 bg-white">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              
              <!-- Username/Email Field -->
              <div class="mb-3">
                <label class="form-label small fw-semibold text-secondary">Username or Email</label>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0 text-muted">
                    <i class="bi bi-person"></i>
                  </span>
                  <input type="text" formControlName="usernameOrEmail" class="form-control border-start-0 ps-0"
                         placeholder="e.g. admin or admin@company.com"
                         [class.is-invalid]="f['usernameOrEmail'].touched && f['usernameOrEmail'].errors">
                </div>
                @if (f['usernameOrEmail'].touched && f['usernameOrEmail'].errors) {
                  <div class="text-danger small mt-1">
                    @if (f['usernameOrEmail'].errors['required']) {
                      Username or Email is required.
                    }
                  </div>
                }
              </div>

              <!-- Password Field -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center">
                  <label class="form-label small fw-semibold text-secondary">Password</label>
                  <span class="small text-muted" style="font-size: 0.78rem;">Default: Admin&#64;123</span>
                </div>
                <div class="input-group">
                  <span class="input-group-text bg-light border-end-0 text-muted">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input [type]="showPassword ? 'text' : 'password'" formControlName="password" class="form-control border-start-0 border-end-0 ps-0"
                         placeholder="Enter your password"
                         [class.is-invalid]="f['password'].touched && f['password'].errors">
                  <button type="button" class="input-group-text bg-light border-start-0 text-muted" (click)="showPassword = !showPassword">
                    <i class="bi" [ngClass]="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                  </button>
                </div>
                @if (f['password'].touched && f['password'].errors) {
                  <div class="text-danger small mt-1">
                    @if (f['password'].errors['required']) {
                      Password is required.
                    }
                  </div>
                }
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 shadow-sm"
                      [disabled]="loginForm.invalid || isLoading">
                @if (isLoading) {
                  <span class="spinner-border spinner-border-sm" role="status"></span>
                  Signing In...
                } @else {
                  <i class="bi bi-box-arrow-in-right fs-5"></i>
                  Sign In to Dashboard
                }
              </button>
            </form>

            <!-- Quick Demo Credentials Fill -->
            <div class="mt-4 pt-3 border-top">
              <span class="text-muted small d-block mb-2 text-center">Quick Demo Login:</span>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-outline-secondary btn-sm flex-fill" (click)="fillDemo('admin', 'Admin@123')">
                  <i class="bi bi-shield-lock me-1"></i> Admin
                </button>
                <button type="button" class="btn btn-outline-secondary btn-sm flex-fill" (click)="fillDemo('hr_manager', 'Admin@123')">
                  <i class="bi bi-person-gear me-1"></i> HR Lead
                </button>
              </div>
            </div>

          </div>

          <!-- Card Footer -->
          <div class="card-footer text-center py-3 bg-light border-0">
            <span class="text-muted small">&copy; 2026 StaffHub Enterprise Solutions.</span>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      background: radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.08) 0%, rgba(248, 250, 252, 1) 90%);
    }

    .login-header {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
    }

    .brand-badge {
      width: 58px;
      height: 58px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  showPassword: boolean = false;
  returnUrl: string = '/dashboard';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    this.loginForm = this.fb.group({
      usernameOrEmail: ['admin', [Validators.required]],
      password: ['Admin@123', [Validators.required]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  fillDemo(user: string, pass: string) {
    this.loginForm.patchValue({
      usernameOrEmail: user,
      password: pass
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.toastService.success(`Welcome back, ${response.data.fullName}!`, 'Login Successful');
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error?.message || 'Invalid username or password. Please verify credentials.';
        this.toastService.error(msg, 'Authentication Failed');
      }
    });
  }
}
