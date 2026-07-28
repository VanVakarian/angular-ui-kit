# V-Color-Picker

Preset color swatches plus a native color input for picking an arbitrary color. No external dependency — `<input type="color">` covers the "not in the presets" case.

## Basic Usage

```html
<v-color-picker
  [value]="category.color"
  (valueChange)="category.color = $event">
</v-color-picker>
```

## Properties

```ts
presets: string[]         // 12 curated preset colors by default
swatchSize: CssUnitValue = 6
gap: CssUnitValue = 2
```

## Events

- `valueChange: string | null`
- `onChanged: string | null`
