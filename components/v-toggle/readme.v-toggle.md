# V-Toggle

Segmented toggle control built on top of the card and button styles. Supports single or multiple selection and stretches items to the full width.

## Basic Usage

```html
<v-toggle
  [items]="sizeOptions"
  [value]="selected"
  (valueChange)="selected = $event"></v-toggle>
```

## Multiple Selection

```html
<v-toggle
  [items]="filters"
  [config]="{ isMultiple: true }"
  [value]="selectedFilters"
  (valueChange)="selectedFilters = $event"></v-toggle>
```

## Config API

```ts
interface VToggleItem {
  id: string;
  label: string;
  isDisabled?: boolean;
}

interface VToggleConfig {
  isMultiple?: boolean;
  isDisabled?: boolean;
  activeClass?: string;
  inactiveClass?: string;
  borderRadius?: CssUnitValue;
  padding?: CssUnitValue;
  gap?: CssUnitValue;
  buttonConfig?: VButtonConfig;
}
```

Defaults: `isMultiple=false`, `isDisabled=false`, `activeClass='v-primary'`, `inactiveClass='v-flat'`, `borderRadius=2`, `padding=1`, `gap=1`.

## Events

- `valueChange: string[]`
- `onChanged: string[]`
