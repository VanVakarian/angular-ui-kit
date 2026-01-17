# V-Slider

Neumorphic slider with unified config, single or range mode, touch areas, and optional discrete value lists.

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
  barStyle?: ProgressBarStyle; // Flat | Raised | Inset
  thumbSize?: CssUnitValue;
  isRange?: boolean;
  isTouchMode?: boolean;
  touchAreaSize?: CssUnitValue;
}
```

Defaults: `min=0`, `max=100`, `height=3`, `borderRadius=2`, `thumbBorderRadius='full'`, `trackColor='var(--v-color-surface)'`, `fillColor='var(--v-color-accent)'`, `barStyle=Flat`, `thumbSize=6`, `isRange=false`, `isTouchMode=false`, `touchAreaSize=12`, `valueList=[]`.

## Events

- `valueChange: number`
- `rangeChange: [number, number]`

## Examples (minimal but diverse)

```html
<!-- Squarish thumbs + touch area -->
<v-slider
  [config]="{
    min: 0,
    max: 100,
    isRange: true,
    barStyle: ProgressBarStyle.Inset,
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
```
