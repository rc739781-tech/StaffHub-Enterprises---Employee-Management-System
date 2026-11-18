import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center min-vh-100 p-4 text-center">
      <div>
        <h1 class="display-1 fw-bold text-primary mb-0">404</h1>
        <h3 class="fw-bold text-dark mt-2">Page Not Found</h3>
        <p class="text-muted mb-4">The page or resource you are looking for might have been moved or removed.</p>
        <a routerLink="/dashboard" class="btn btn-primary px-4 py-2">
          <i class="bi bi-house-door-fill me-1"></i> Return to Dashboard
        </a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}
