# V-Button

Flat design button with attribute-based style modes and a single typed config for all settings. Supports dark theme.

## Overview

- Style modes via CSS classes: `v-primary`, `v-danger`, `v-flat`, `v-raised`, `v-link`, etc.
- All other settings (size, width, behavior, states) are configured via a single `[config]` object.
- Prefix/postfix content via `v-prefix` / `v-postfix` for icons and badges.
- Built with modern Angular signals.
- Supports dark theme and smooth transitions.

## Anatomy

```
<v-button ...>
  <button>
    <ng-content select="[v-prefix]" />
    <div class="btn-text"><ng-content /></div>
    <ng-content select="[v-postfix]" />
  </button>
</v-button>
```

## Styling modes

- `v-primary` — primary action with accent color background
- `v-danger` — destructive/alert action with danger color
- `v-accent` — alternative accent styling
- `v-flat` — clean flat look with borders and subtle hover effects
- `v-raised` — elevated appearance with subtle shadows
- `v-link` — link-style button (transparent, text only)
- `v-hover` — special hover-only styling

Choose a mode by adding the corresponding class to the component.

## Quick start

```html
<!-- Class-based style -->
<v-button class="v-primary">Primary</v-button>
<v-button class="v-danger">Danger</v-button>
<v-button class="v-flat">Flat</v-button>
```

## Config API

```ts
interface VButtonConfig {
  type?: 'button' | 'submit' | 'reset';
  width?: string;                      // '100%', '240px', etc.
  isLabelHidden?: boolean;             // hides main label text
  paddingY?: CssUnitValue;             // vertical padding (unit system)
  paddingX?: CssUnitValue;             // horizontal padding
  isDisabled?: boolean;                // disabled state
  isWithoutShadow?: boolean;           // removes shadows (for v-raised)
  bgOpacity?: '0' | '1' | `0.${number}`; // background opacity
}
```

Defaults: `type='button'`, `paddingY=2`, `paddingX=4`, `isDisabled=false`, `isWithoutShadow=false`, `bgOpacity='1'`.

## Usage patterns (minimal but diverse)

```html
<!-- 1) Icon-only: hide label, compact paddings -->
<v-button class="v-flat" [config]="{ isLabelHidden: true, paddingX: 2 }">
  <span v-prefix>⚙️</span>
  Settings
</v-button>

<!-- 2) Destructive action with custom paddings -->
<v-button class="v-danger" [config]="{ paddingY: 1, paddingX: 6 }">Delete</v-button>

<!-- 3) Full width primary button -->
<v-button class="v-primary" [config]="{ width: '100%' }">Continue</v-button>

<!-- 4) Transparent background (bgOpacity=0) -->
<v-button class="v-flat" [config]="{ bgOpacity: '0', paddingX: 0, paddingY: 0 }">
  <span v-prefix>✕</span>
</v-button>

<!-- 5) Disabled state -->
<v-button class="v-primary" [config]="{ isDisabled: true }">Disabled</v-button>

<!-- 6) Link-style button -->
<v-button class="v-link">Learn more</v-button>
```

## Content projection

- Prefix: `[v-prefix]` — rendered to the left of the label (icon, indicator)
- Main label: projected content, can be hidden via `isLabelHidden`
- Postfix: `[v-postfix]` — rendered to the right (badge, arrow, hotkey)

Example:

```html
<v-button class="v-raised">
  <span v-prefix>🔍</span>
  Search
  <span v-postfix>→</span>
</v-button>
```

## Accessibility

- Semantic `<button>` with `type` and `disabled` support.
- `aria-disabled` is set automatically.
- Provide meaningful text or an `aria-label` when using `isLabelHidden`.

## Theming & CSS vars

- Paddings use unit system: `--unit-N` (see `vars.css`).
- Background opacity is controlled via `--v-button-bg-opacity` by `config.bgOpacity`.
- Colors are driven by theme variables (`--v-color-*`).
- Supports dark mode via `:host-context(.dark)` context.
- Smooth transitions for hover/active states (0.2s).
- Color mixing for hover/active states using CSS `color-mix()`.

## Sizing & layout

- Width: use `config.width` or plain CSS classes/styles on `v-button`.
- Label text is wrapped in `.btn-text` for predictable layout.

## Behavior & states

- Hover/active visuals with smooth color mixing transitions.
- `isWithoutShadow` disables shadows for v-raised style.
- Disabled blocks pointer events and reduces opacity to 0.4.
- Ripple effect on click for enhanced interactivity.
- Dark mode automatically adjusts color mixing ratios.

## Events

- `onClick: MouseEvent` — emitted on click (when not disabled).

## Best practices

- Use class-based styling (e.g., `.v-primary`, `.v-flat`).
- When hiding the label, set an accessible `aria-label` if needed.
- Prefer unit values for paddings to keep consistent spacing.
- Keep buttons concise; use postfix/prefix for icons and badges.
- Use `.v-link` for inline text-style actions.
- Combine `.v-link.v-link-static` to prevent color changes on hover.
