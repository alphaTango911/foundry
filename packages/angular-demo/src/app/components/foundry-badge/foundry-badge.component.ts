import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'neutral';

@Component({
  selector: 'app-foundry-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="badgeClasses">
      <ng-content />
    </span>
  `,
  styles: [`
    span {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.625rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
      border: 1px solid transparent;
    }
    .badge-primary {
      background-color: var(--color-primary-bg);
      color: var(--color-primary-text);
      border-color: var(--color-primary-border);
    }
    .badge-success {
      background-color: var(--color-success-bg);
      color: var(--color-success-text);
      border-color: var(--color-success-border);
    }
    .badge-warning {
      background-color: var(--color-warning-bg);
      color: var(--color-warning-text);
      border-color: var(--color-warning-border);
    }
    .badge-error {
      background-color: var(--color-error-bg);
      color: var(--color-error-text);
      border-color: var(--color-error-border);
    }
    .badge-neutral {
      background-color: var(--color-neutral-surface);
      color: var(--color-neutral-text);
      border-color: var(--color-neutral-border);
    }
  `]
})
export class FoundryBadgeComponent {
  @Input() variant: BadgeVariant = 'primary';

  get badgeClasses(): string {
    return `badge-${this.variant}`;
  }
}