# V-Button

Flat design button with class-based styles and unified config API. Supports dark theme.

## Basic Usage

```html
<v-button class="v-primary">Primary</v-button>
<v-button class="v-danger">Danger</v-button>
<v-button class="v-flat">Flat</v-button>
```

## Style Classes

- `v-primary` — primary action with accent color
- `v-danger` — destructive/alert action
- `v-accent` — alternative accent
- `v-flat` — flat look with borders
- `v-raised` — elevated with shadows
- `v-link` — link-style (transparent)
- `v-hover` — hover-only styling

## Config API

```ts
interface VButtonConfig {
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  isLabelHidden?: boolean;
  paddingY?: CssUnitValue;
  paddingX?: CssUnitValue;
  isDisabled?: boolean;
  isWithoutShadow?: boolean;
  bgOpacity?: '0' | '1' | `0.${number}`;
}
```

Defaults: `type='button'`, `paddingY=2`, `paddingX=4`, `isDisabled=false`, `isWithoutShadow=false`, `bgOpacity='1'`.

## Events

- `onClick: MouseEvent`

## Examples

```html
<!-- Icon-only: hide label, compact padding -->
<v-button class="v-flat" [config]="{ isLabelHidden: true, paddingX: 2 }">
  <span v-prefix>⚙️</span>
  Settings
</v-button>

<!-- Destructive with custom padding -->
<v-button class="v-danger" [config]="{ paddingY: 1, paddingX: 6 }">Delete</v-button>

<!-- Full width -->
<v-button class="v-primary" [config]="{ width: '100%' }">Continue</v-button>

<!-- Transparent background -->
<v-button class="v-flat" [config]="{ bgOpacity: '0', paddingX: 0, paddingY: 0 }">
  <span v-prefix>✕</span>
</v-button>

<!-- Disabled -->
<v-button class="v-primary" [config]="{ isDisabled: true }">Disabled</v-button>

<!-- Link-style -->
<v-button class="v-link">Learn more</v-button>

<!-- With prefix/postfix -->
<v-button class="v-raised">
  <span v-prefix>🔍</span>
  Search
  <span v-postfix>→</span>
</v-button>
```
