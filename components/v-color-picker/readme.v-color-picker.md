# V-Color-Picker

Preset color swatches plus a native color input for picking an arbitrary color. No external dependency — `<input type="color">` covers the "not in the presets" case.

## Basic Usage

```html
<v-color-picker
  [value]="category.color"
  (valueChange)="category.color = $event">
</v-color-picker>
```

## Config API

```ts
interface VColorPickerConfig {
  presets?: string[];
  swatchSize?: CssUnitValue;
  gap?: CssUnitValue;
}
```

Defaults: 12 curated preset colors, `swatchSize=6`, `gap=2`.

## Events

- `valueChange: string | null`
- `onChanged: string | null`
