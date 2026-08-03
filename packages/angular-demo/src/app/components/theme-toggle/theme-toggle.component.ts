import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button class="toggle" (click)="toggle()" [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'">
      {{ isDark() ? '☀️ Light mode' : '🌙 Dark mode' }}
    </button>
  `,
  styles: [`
    .toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: 1px solid var(--color-neutral-border);
      border-radius: 8px;
      background: var(--color-neutral-surface);
      color: var(--color-neutral-text);
      font-size: 0.875rem;
      font-family: inherit;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .toggle:hover {
      background: var(--color-neutral-surface-hover);
    }
  `]
})
export class ThemeToggleComponent {
  isDark = signal(false);

  toggle() {
    this.isDark.update(v => !v);
    document.documentElement.setAttribute(
      'data-theme',
      this.isDark() ? 'dark' : 'light'
    );
  }
}