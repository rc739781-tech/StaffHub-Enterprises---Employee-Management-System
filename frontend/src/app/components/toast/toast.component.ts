import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100;">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast show align-items-center text-white border-0 mb-2 shadow-lg"
             [ngClass]="'bg-' + toast.type"
             role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
              <i class="bi" [ngClass]="{
                'bi-check-circle-fill': toast.type === 'success',
                'bi-exclamation-triangle-fill': toast.type === 'danger',
                'bi-exclamation-circle-fill': toast.type === 'warning',
                'bi-info-circle-fill': toast.type === 'info'
              }"></i>
              <div>
                @if (toast.title) {
                  <strong>{{ toast.title }}: </strong>
                }
                {{ toast.message }}
              </div>
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="toastService.remove(toast.id)" aria-label="Close"></button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast {
      border-radius: 10px;
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
