# V-Slider

Flat design slider with unified config, single or range mode, touch areas, and optional discrete value lists. Supports dark theme and color classes.

## Basic Usage

```html
<v-slider
  [config]="{ min: 0, max: 100 }"
  [value]="value"
  (valueChange)="value = $event" />
```

## Range Mode

```html
<v-slider
  [config]="{ min: 0, max: 100, isRange: true }"
  [range]="range"
  (rangeChange)="range = $event" />
```

## Config API

```ts
interface VSliderConfig {
  valueList?: number[];
  min?: number;
  max?: number;
  height?: CssUnitValue;
  borderRadius?: CssUnitValue;
  thumbBorderRadius?: CssUnitValue | 'full';
  trackColor?: string;
  fillColor?: string;
  thumbSize?: CssUnitValue;
  isRange?: boolean;
  isTouchMode?: boolean;
  touchAreaSize?: CssUnitValue;
}
```

Defaults: `min=0`, `max=100`, `height=3`, `borderRadius=2`, `thumbBorderRadius='full'`, `trackColor='var(--v-color-surface)'`, `fillColor='var(--v-color-primary)'`, `thumbSize=6`, `isRange=false`, `isTouchMode=false`, `touchAreaSize=12`, `valueList=[]`.

## Events

- `valueChange: number`
- `rangeChange: [number, number]`

## Color Classes

Use `.v-primary`, `.v-danger`, or `.v-accent` to change fill and thumb color:

```html
<v-slider class="v-danger" [config]="{ min: 0, max: 100 }" [value]="value" (valueChange)="value = $event" />
```

## Examples (minimal but diverse)

```html
<!-- Squarish thumbs + touch area -->
<v-slider
  [config]="{
    min: 0,
    max: 100,
    isRange: true,
    thumbBorderRadius: 2,
    thumbSize: 7,
    isTouchMode: true,
    touchAreaSize: 12
  }"
  [range]="range"
  (rangeChange)="range = $event" />

<!-- Discrete list (timestamps) -->
<v-slider
  [config]="{
    isRange: true,
    valueList: dateValues
  }"
  [range]="dateRange"
  (rangeChange)="dateRange = $event" />

<!-- Custom color -->
<v-slider
  class="v-accent"
  [config]="{ min: 0, max: 100 }"
  [value]="value"
  (valueChange)="value = $event" />
```
