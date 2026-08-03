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
            The same token system that powers the React app —
            driving these Angular components. Zero changes to the engine.
          </p>
        </div>
        <app-theme-toggle />
      </header>

      <section class="section">
        <h2>Buttons</h2>
        <p class="section-desc">
          All variants use CSS custom properties from foundry/core tokens.css
        </p>
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
          <app-foundry-badge variant="error">Error</app-foundry-badge