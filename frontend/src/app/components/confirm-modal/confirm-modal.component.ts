import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop fade show"></div>
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content border-0 shadow-lg" style="border-radius: 16px; overflow: hidden;">
            <div class="modal-header bg-danger text-white border-0 py-3">
              <h5 class="modal-title d-flex align-items-center gap-2 mb-0">
                <i class="bi bi-exclamation-triangle-fill fs-5"></i>
                {{ title }}
              </h5>
              <button type="button" class="btn-close btn-close-white" (click)="onCancel()"></button>
            </div>
            <div class="modal-body py-4 px-4">
              <p class="text-secondary fs-6 mb-0">{{ message }}</p>
            </div>
            <div class="modal-footer bg-light border-0 px-4 py-3">
              <button type="button" class="btn btn-secondary px-3" (click)="onCancel()">
                <i class="bi bi-x me-1"></i> Cancel
              </button>
              <button type="button" class="btn btn-danger px-3 shadow-sm" (click)="onConfirm()">
                <i class="bi bi-trash3 me-1"></i> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = 'Confirm Deletion';
  @Input() message: string = 'Are you sure you want to delete this item? This action cannot be undone.';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
