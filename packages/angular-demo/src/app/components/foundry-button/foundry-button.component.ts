import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-foundry-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled"
      (click)="clicked.emit($event)"
    >
      <ng-content />
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border: 1px solid transparent;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.15s, border-color 0.15s, opacity 0.15s;
      font-family: inherit;
    }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-sm { padding: 0.375rem 0.75rem; font-size: 0.875rem; }
    .btn-md { padding: 0.5rem 1rem; font-size: 1rem; }
    .btn-lg { padding: 0.75rem 1.5rem; font-size: 1.125rem; }
    .btn-primary {
      background-color: var(--color-primary-fill);
      border-color: var(--color-primary-fill);
      color: var(--color-primary-contrast-text);
    }
    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-primary-fill-active);
      border-color: var(--color-primary-fill-active);
    }
    .btn-secondary {
      background-color: var(--color-primary-bg);
      border-color: var(--color-primary-border);
      color: var(--color-primary-text);
    }
    .btn-secondary:hover:not(:disabled) {
      background-color: var(--color-primary-bg-hover);
      border-color: var(--color-primary-border-hover);
    }
    .btn-ghost {
      background-color: transparent;
      border-color: var(--color-neutral-border);
      color: var(--color-neutral-text);
    }
    .btn-ghost:hover:not(:disabled) {
      background-color: var(--color-neutral-surface);
    }
    .btn-danger {
      background-color: var(--color-error-fill);
      border-color: var(--color-error-fill);
      color: var(--color-error-contrast-text);
    }
    .btn-danger:hover:not(:disabled) {
      background-color: var(--color-error-fill-active);
      border-color: var(--color-error-fill-active);
    }
  `]
})
export class FoundryButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return `btn-${this.variant} btn-${this.size}`;
  }
}