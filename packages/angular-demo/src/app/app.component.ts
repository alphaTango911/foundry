import { Component } from '@angular/core';
import { FoundryButtonComponent } from './components/foundry-button/foundry-button.component';
import { FoundryBadgeComponent } from './components/foundry-badge/foundry-badge.component';
import { FoundryInputComponent } from './components/foundry-input/foundry-input.component';
import { FoundryCardComponent } from './components/foundry-card/foundry-card.component';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';

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
            The same token system that powers the React app,
            driving these Angular components. Zero changes to the engine.
          </p>
        </div>
        <app-theme-toggle />
      </header>

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
        <p>This Angular app imports one file from foundry core:</p>
        <pre class="code">import './foundry-tokens.css'</pre>
        <p>Every component uses only CSS custom properties:</p>
        <pre class="code">background-color: var(--color-primary-fill);
color: var(--color-primary-contrast-text);
border-color: var(--color-neutral-border);</pre>
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
    @media (max-width: 640px) {
      .inputs-grid, .cards-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AppComponent {}