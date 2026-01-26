# V-Icon

SVG icon component with size and color control. Supports dark theme.

## Basic Usage

```html
<v-icon name="home" />
```

## Icon Sizes

```typescript
enum IconSize {
  XS = 1,  // 4px
  S = 2,   // 8px
  M = 4,   // 16px (default)
  L = 6,   // 24px
  XL = 8,  // 32px
}
```

## API

```ts
// Inputs
name: string         // Required, icon filename
size: CssUnitValue | IconSize = IconSize.M
color: string = 'var(--color-text-default)'
```

## Examples

```html
<!-- Different sizes -->
<v-icon name="settings" [size]="IconSize.XS" />
<v-icon name="user" [size]="6" />

<!-- Custom color -->
<v-icon name="star" color="var(--color-primary)" />

<!-- In buttons -->
<v-button raised>
  <v-icon v-prefix name="plus" [size]="IconSize.S" />
  Add
</v-button>

<!-- Icon-only button -->
<v-button flat>
  <v-icon name="close" />
</v-button>

<!-- Clickable icon -->
<v-icon name="heart" class="clickable" (click)="onHeartClick()" />
```

## Icon Location

Place SVG files in `/src/assets/{name}.svg`

Component automatically resolves path: `assets/{name}.svg`
