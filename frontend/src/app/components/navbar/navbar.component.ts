import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="top-navbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white">
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-light d-lg-none p-2 rounded-3" (click)="toggleSidebar.emit()">
          <i class="bi bi-list fs-5"></i>
        </button>
        <div class="d-none d-sm-block">
          <span class="text-muted small">Welcome back,</span>
          <h6 class="mb-0 fw-bold text-dark">{{ authService.currentUser()?.fullName || 'User' }}</h6>
        </div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <!-- Role badge -->
        <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
          <i class="bi bi-shield-check me-1"></i> {{ authService.currentUser()?.role || 'Admin' }}
        </span>

        <!-- User profile dropdown info -->
        <div class="d-flex align-items-center gap-2 ps-2 border-start">
          <div class="avatar-circle">
            {{ (authService.currentUser()?.fullName || 'U').charAt(0) }}
          </div>
          <div class="d-none d-md-block text-start">
            <div class="fw-semibold small text-dark">{{ authService.currentUser()?.username }}</div>
            <div class="text-muted" style="font-size: 0.75rem;">{{ authService.currentUser()?.email }}</div>
          </div>
          <button class="btn btn-outline-danger btn-sm ms-2 rounded-pill px-3" (click)="logout()" title="Logout">
            <i class="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .top-navbar {
      height: 68px;
      position: sticky;
      top: 0;
      z-index: 1020;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
  `]
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
