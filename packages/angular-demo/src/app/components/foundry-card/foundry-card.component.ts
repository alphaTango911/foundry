import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-foundry-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <div *ngIf="title || badge" class="card-header">
        <h3 *ngIf="title" class="card-title">{{ title }}</h3>
        <span *ngIf="badge" class="card-badge" [class]="'badge-' + badgeVariant">
          {{ badge }}
        </span>
      </div>
      <div class="card-body">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: var(--color-neutral-surface);
      border: 1px solid var(--color-neutral-border);
      border-radius: 12px;
      padding: 1.5rem;
      transition: box-shadow 0.15s;
    }
    .card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--color-neutral-text-strong);
      margin: 0;
    }
    .card-body {
      color: var(--color-neutral-text);
      font-size: 0.875rem;
      line-height: 1.6;
    }
    .card-badge {
      font-size: 0.75rem;
      font-weight: 500;
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      border: 1px solid transparent;
    }
    .badge-success {
      background: var(--color-success-bg);
      color: var(--color-success-text);
      border-color: var(--color-success-border);
    }
    .badge-warning {
      background: var(--color-warning-bg);
      color: var(--color-warning-text);
      border-color: var(--color-warning-border);
    }
    .badge-error {
      background: var(--color-error-bg);
      color: var(--color-error-text);
      border-color: var(--color-error-border);
    }
  `]
})
export class FoundryCardComponent {
  @Input() title = '';
  @Input() badge = '';
  @Input() badgeVariant: 'success' | 'warning' | 'error' = 'success';
}