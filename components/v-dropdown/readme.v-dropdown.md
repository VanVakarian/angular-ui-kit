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
mode: 'search' | 'select' = 'search'
label: string = ''
labelRight: string = ''
placeholder: string = ''
items: DropdownItem[] = []
isDisabled: boolean = false
isRequired: boolean = false
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

<!-- Select-only mode -->
<v-dropdown
  placeholder="Sort"
  [items]="options"
  [mode]="'select'"
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
