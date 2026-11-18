import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent, ToastComponent],
  template: `
    <app-toast></app-toast>

    @if (authService.isAuthenticated()) {
      <div class="app-layout">
        <!-- Sidebar Navigation -->
        <app-sidebar [isOpen]="isSidebarOpen"></app-sidebar>

        <!-- Main Wrapper -->
        <div class="main-wrapper">
          <!-- Top Navbar -->
          <app-navbar (toggleSidebar)="toggleSidebar()"></app-navbar>

          <!-- Main Content Area -->
          <main class="page-content">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    } @else {
      <!-- Unauthenticated View (Login) -->
      <router-outlet></router-outlet>
    }
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-main);
    }

    .main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 260px;
      min-width: 0;
      transition: margin-left 0.3s ease;
    }

    .page-content {
      flex: 1;
    }

    @media (max-width: 991.98px) {
      .main-wrapper {
        margin-left: 0;
      }
    }
  `]
})
export class AppComponent {
  isSidebarOpen: boolean = false;

  constructor(public authService: AuthService) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
