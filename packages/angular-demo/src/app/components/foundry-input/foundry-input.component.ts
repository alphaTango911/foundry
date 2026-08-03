import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-foundry-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-wrapper">
      <label *ngIf="label" [for]="inputId" class="input-label">
        {{ label }}
      </label>
      <input
        [id]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        (input)="valueChange.emit($any($event.target).value)"
        class="input-field"
        [class.input-error]="hasError"
      />
      <span *ngIf="hint" class="input-hint">{{ hint }}</span>
      <span *ngIf="errorMessage" class="input-error-msg">{{ errorMessage }}</span>
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .input-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-neutral-text-strong);
    }
    .input-field {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--color-neutral-border);
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      background-color: var(--color-neutral-surface);
      color: var(--color-neutral-text-strong);
      transition: border-color 0.15s, box-shadow 0.15s;
      outline: none;
    }
    .input-field:focus {
      border-color: var(--color-primary-fill);
      box-shadow: 0 0 0 3px var(--color-primary-bg);
    }
    .input-field:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .input-field.input-error {
      border-color: var(--color-error-fill);
    }
    .input-field.input-error:focus {
      box-shadow: 0 0 0 3px var(--color-error-bg);
    }
    .input-hint {
      font-size: 0.75rem;
      color: var(--color-neutral-text-muted);
    }
    .input-error-msg {
      font-size: 0.75rem;
      color: var(--color-error-text);
    }
  `]
})
export class FoundryInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() value = '';
  @Input() disabled = false;
  @Input() hint = '';
  @Input() errorMessage = '';
  @Input() hasError = false;
  @Input() inputId = `input-${Math.random().toString(36).slice(2)}`;
  @Output() valueChange = new EventEmitter<string>();
}