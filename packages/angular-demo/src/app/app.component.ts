import { Component } from '@angular/core';
import { FoundryButtonComponent } from './components/foundry-button/foundry-button.component';
import { FoundryBadgeComponent } from './components/foundry-badge/foundry-badge.component';
import { FoundryInputComponent } from './components/foundry-input/foundry-input.component';
import { FoundryCardComponent } from './components/foundry-card/foundry-card.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import {
  generateSemanticTokens,
  generateThemeCSS,
  validateHex,
} from '@foundry-ds/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FoundryButtonComponent,
    FoundryBadgeComponent,
    FoundryInputComponent,
    FoundryCardComponent,
    ThemeToggleComponent,
  ],
  template: `
    <div class="container">

      <header class="header">
        <div>
          <h1>Foundry <span class="tag">Angular Demo</span></h1>
          <p class="subtitle">
            The same token system that powers the
            <a href="https://foundry-web-lilac.vercel.app/" target="_blank" class="link">
              React app
            </a>
            — driving these Angular components. Zero changes to the engine.
          </p>
        </div>
        <app-theme-toggle />
      </header>

      <!-- Live color preview bar -->
      <div class="color-preview-bar">
        <span class="color-label">Try your brand color:</span>
        <div class="color-input-group">
          <input
            type="color"
            [value]="accentColor"
            (input)="onAccentChange($any($event.target).value)"
            class="color-picker"
            title="Pick a color"
          />
          <input
            type="text"
            [value]="accentColor"
            (input)="onAccentChange($any($event.target).value)"
            placeholder="#3a5afe"
            class="color-text-input"
          />
          <button
            class="copy-btn"
            (click)="copyHex()"
            [class.copied]="hexCopied"
            title="Copy hex value"
          >
            {{ hexCopied ? '✓' : 'Copy' }}
          </button>
        </div>
        <span class="color-hint">
          All colors update via &#64;foundry/core — same engine as the React app
        </span>
      </div>

      <section class="section">
        <h2>Buttons</h2>
        <div class="row">
          <app-foundry-button variant="primary">Primary</app-foundry-button>
          <app-foundry-button variant="secondary">Secondary</app-foundry-button>
          <app-foundry-button variant="ghost">Ghost</app-foundry-button>
          <app-foundry-button variant="danger">Danger</app-foundry-button>
          <app-foundry-button variant="primary" [disabled]="true">Disabled</app-foundry-button>
        </div>
        <div class="row">
          <app-foundry-button variant="primary" size="sm">Small</app-foundry-button>
          <app-foundry-button variant="primary" size="md">Medium</app-foundry-button>
          <app-foundry-button variant="primary" size="lg">Large</app-foundry-button>
        </div>
      </section>

      <section class="section">
        <h2>Badges</h2>
        <div class="row">
          <app-foundry-badge variant="primary">Primary</app-foundry-badge>
          <app-foundry-badge variant="success">Success</app-foundry-badge>
          <app-foundry-badge variant="warning">Warning</app-foundry-badge>
          <app-foundry-badge variant="error">Error</app-foundry-badge>
          <app-foundry-badge variant="neutral">Neutral</app-foundry-badge>
        </div>
      </section>

      <section class="section">
        <h2>Inputs</h2>
        <div class="inputs-grid">
          <app-foundry-input
            label="Email address"
            placeholder="you@example.com"
            type="email"
            hint="We will never share your email"
          />
          <app-foundry-input
            label="Password"
            placeholder="Enter password"
            type="password"
            [hasError]="true"
            errorMessage="Password must be at least 8 characters"
          />
        </div>
      </section>

      <section class="section">
        <h2>Cards</h2>
        <div class="cards-grid">
          <app-foundry-card title="API Response" badge="200 OK" badgeVariant="success">
            Request completed in 142ms. All systems operational.
          </app-foundry-card>
          <app-foundry-card title="Rate Limit" badge="Warning" badgeVariant="warning">
            Approaching rate limit. 847 of 1000 requests used this hour.
          </app-foundry-card>
          <app-foundry-card title="Build Failed" badge="Error" badgeVariant="error">
            TypeScript compilation failed. 3 errors in 2 files.
          </app-foundry-card>
        </div>
      </section>

      <section class="section proof">
        <h2>How it works</h2>
        <p>This Angular app imports the real &#64;foundry-ds/core package:</p>
        <pre class="code">import &#123; generateSemanticTokens, generateThemeCSS &#125; from '&#64;foundry-ds/core';

      const tokens = generateSemanticTokens(&#123; accentColor: '#3a5afe' &#125;);
      const &#123; combined &#125; = generateThemeCSS(tokens);
      // Inject CSS into page - all components update instantly</pre>
        <p>Toggle dark mode above to see the same token contract adapt both themes.</p>
      </section>

    </div>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 2rem 0;
      border-bottom: 1px solid var(--color-neutral-border);
      margin-bottom: 2rem;
    }
    .tag {
      font-size: 0.875rem;
      font-weight: 500;
      background: var(--color-primary-bg);
      color: var(--color-primary-text);
      border: 1px solid var(--color-primary-border);
      border-radius: 6px;
      padding: 0.2rem 0.5rem;
      vertical-align: middle;
      margin-left: 0.5rem;
    }
    .subtitle {
      color: var(--color-neutral-text);
      margin-top: 0.5rem;
      max-width: 500px;
    }
    .section { margin-bottom: 3rem; }
    h2 { color: var(--color-neutral-text-strong); margin-bottom: 0.5rem; }
    .row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 0.75rem;
    }
    .inputs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .proof {
      background: var(--color-neutral-surface);
      border: 1px solid var(--color-neutral-border);
      border-radius: 12px;
      padding: 1.5rem;
    }
    .proof p { color: var(--color-neutral-text); margin: 0.75rem 0; }
    .code {
      background: var(--color-neutral-background);
      border: 1px solid var(--color-neutral-border);
      border-radius: 8px;
      padding: 1rem;
      font-family: monospace;
      font-size: 0.875rem;
      color: var(--color-primary-text);
      white-space: pre;
      overflow-x: auto;
      margin: 0.5rem 0;
    }
    .link {
      color: var(--color-primary-text);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .link:hover { color: var(--color-primary-fill); }
    .color-preview-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.25rem;
      background: var(--color-neutral-surface);
      border: 1px solid var(--color-neutral-border);
      border-radius: 12px;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .color-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-neutral-text-strong);
      white-space: nowrap;
    }
    .color-input-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: var(--color-neutral-background);
      border: 1px solid var(--color-neutral-border);
      border-radius: 8px;
      padding: 0.375rem 0.75rem;
    }
    .color-picker {
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      padding: 0;
      background: none;
      flex-shrink: 0;
    }
    .color-text-input {
      border: none;
      background: transparent;
      font-family: monospace;
      font-size: 0.875rem;
      color: var(--color-neutral-text-strong);
      outline: none;
      width: 90px;
    }
    .copy-btn {
      border: 1px solid var(--color-neutral-border);
      background: var(--color-neutral-surface);
      color: var(--color-neutral-text);
      border-radius: 6px;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .copy-btn:hover { background: var(--color-neutral-surface-hover); }
    .copy-btn.copied {
      background: var(--color-success-bg);
      color: var(--color-success-text);
      border-color: var(--color-success-border);
    }
    .color-hint {
      font-size: 0.75rem;
      color: var(--color-neutral-text-muted);
      font-style: italic;
    }
    @media (max-width: 640px) {
      .inputs-grid, .cards-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AppComponent {
  accentColor = '#3a5afe';
  hexCopied = false;

  constructor() {
    // Generate initial tokens on load
    this.applyTokens(this.accentColor);
  }

  onAccentChange(value: string): void {
    const clean = value.startsWith('#') ? value : `#${value}`;
    if (!/^#[0-9a-fA-F]{6}$/.test(clean)) return;
    this.accentColor = clean;
    this.applyTokens(clean);
  }

  copyHex(): void {
    navigator.clipboard.writeText(this.accentColor);
    this.hexCopied = true;
    setTimeout(() => this.hexCopied = false, 1500);
  }

  private applyTokens(hex: string): void {
    const validation = validateHex(hex);
    if (!validation.valid) return;

    try {
      // Use the real @foundry/core engine — same as the React app
      const tokens = generateSemanticTokens({
        accentColor: validation.value ?? hex,
      });
      const { combined } = generateThemeCSS(tokens);

      // Inject the generated CSS into the page
      let style = document.getElementById('foundry-dynamic') as HTMLStyleElement;
      if (!style) {
        style = document.createElement('style');
        style.id = 'foundry-dynamic';
        document.head.appendChild(style);
      }
      style.textContent = combined;
    } catch (err) {
      console.error('Token generation failed:', err);
    }
  }
}