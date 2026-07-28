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
  [isMultiple]="true"
  [value]="selectedFilters"
  (valueChange)="selectedFilters = $event"></v-toggle>
```

## Properties

```ts
interface VToggleItem {
  id: string;
  label: string;
  isDisabled?: boolean;
}
```

```ts
items: VToggleItem[] = []
isMultiple: boolean = false
isDisabled: boolean = false
fitContent: boolean = false
borderRadius: CssUnitValue = 2
padding: CssUnitValue = 1
gap: CssUnitValue = 1
activeClass: string = 'v-primary'
inactiveClass: string = 'v-flat'
```

## Events

- `valueChange: string[]`
- `onChanged: string[]`
