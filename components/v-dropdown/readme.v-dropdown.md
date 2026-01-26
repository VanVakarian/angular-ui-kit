# V-Dropdown

Searchable dropdown with automatic filtering and form integration. Uses flat design and supports dark theme.

## Basic Usage

```html
<v-dropdown
  label="Select Item"
  placeholder="Search..."
  [items]="items"
/>
```

## Data Format

```typescript
interface DropdownItem {
  value: string;  // form value
  label: string;  // display text
}
```

## Properties

```ts
label: string = ''
placeholder: string = ''
items: DropdownItem[] = []
isDisabled: boolean = false
errorMessage: string = ''
minDropdownWidth: string = ''
expandDirection: 'left' | 'right' = 'left'
```

## Events

- `onSelectionChanged: DropdownItem | null`

## Examples

```html
<!-- With forms -->
<v-dropdown
  label="Food Type"
  placeholder="Search food..."
  formControlName="food"
  [items]="items"
  (onSelectionChanged)="onSelect($event)"
/>

<!-- Right-aligned -->
<v-dropdown
  placeholder="Quick select"
  [items]="options"
  [expandDirection]="'right'"
/>

<!-- Disabled state -->
<v-dropdown
  label="Loading..."
  [items]="[]"
  [isDisabled]="true"
/>

<!-- Custom min width -->
<v-dropdown
  label="Category"
  [items]="categories"
  [minDropdownWidth]="'250px'"
  formControlName="category"
/>
```
