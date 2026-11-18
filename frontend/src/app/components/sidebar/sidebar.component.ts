import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.sidebar-open]="isOpen">
      <div class="sidebar-brand d-flex align-items-center gap-3 px-4 py-3 border-bottom border-secondary border-opacity-25">
        <div class="brand-logo-box">
          <i class="bi bi-people-fill fs-4 text-white"></i>
        </div>
        <div>
          <h5 class="mb-0 text-white fw-bold brand-title">StaffHub</h5>
          <span class="text-white-50" style="font-size: 0.72rem; letter-spacing: 0.05em; text-transform: uppercase;">Employee Portal</span>
        </div>
      </div>

      <div class="sidebar-nav px-3 py-4">
        <div class="nav-section-title px-3 mb-2 text-uppercase fw-semibold" style="font-size: 0.7rem; color: #64748b;">
          Core Management
        </div>

        <ul class="nav flex-column gap-1">
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-secondary"
               routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <i class="bi bi-grid-1x2-fill fs-5"></i>
              <span>Dashboard</span>
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-secondary"
               routerLink="/employees" routerLinkActive="active">
              <i class="bi bi-person-badge-fill fs-5"></i>
              <span>Employees</span>
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-secondary"
               routerLink="/departments" routerLinkActive="active">
              <i class="bi bi-building-fill fs-5"></i>
              <span>Departments</span>
            </a>
          </li>
        </ul>

        <div class="nav-section-title px-3 mt-4 mb-2 text-uppercase fw-semibold" style="font-size: 0.7rem; color: #64748b;">
          Quick Shortcuts
        </div>

        <ul class="nav flex-column gap-1">
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-secondary"
               routerLink="/employees/new" routerLinkActive="active">
              <i class="bi bi-person-plus-fill fs-5 text-success"></i>
              <span>Add Employee</span>
            </a>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer mt-auto px-4 py-3 border-top border-secondary border-opacity-25 text-center">
        <small class="text-white-50" style="font-size: 0.75rem;">
          StaffHub Enterprise v1.0<br>ASP.NET Core &bull; Angular
        </small>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      background-color: var(--sidebar-bg);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1030;
      transition: transform 0.3s ease;
    }

    .brand-logo-box {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.4);
    }

    .nav-link {
      color: #94a3b8 !important;
      font-weight: 500;
      font-size: 0.92rem;
      transition: all 0.2s ease;
    }

    .nav-link:hover {
      color: #ffffff !important;
      background-color: #1e293b;
    }

    .nav-link.active {
      color: #ffffff !important;
      background: linear-gradient(90deg, #4f46e5, #4338ca);
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
      font-weight: 600;
    }

    @media (max-width: 991.98px) {
      .sidebar {
        transform: translateX(-100%);
      }
      .sidebar.sidebar-open {
        transform: translateX(0);
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
}
