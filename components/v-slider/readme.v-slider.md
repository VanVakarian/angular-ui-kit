# V-Slider

Flat design slider with individual property API, single or range mode, touch areas, and optional discrete value lists. Supports dark theme and color classes.

## Basic Usage

```html
<v-slider
  [min]="0"
  [max]="100"
  [value]="value"
  (valueChange)="value = $event" />
```

## Range Mode

```html
<v-slider
  [min]="0"
  [max]="100"
  [isRange]="true"
  [range]="range"
  (rangeChange)="range = $event" />
```

## Properties

```ts
valueList: number[] = []
isDisabled: boolean = false
isRange: boolean = false
isTouchMode: boolean = false
min: number = 0
max: number = 100
height: CssUnitValue = 3          // participates in JS drag/position math — steps only, no raw CSS
borderRadius: CssUnitOrRawValue = 2
thumbBorderRadius: CssUnitOrRawValue = '50%'
thumbSize: CssUnitValue = 6        // participates in JS drag/position math — steps only, no raw CSS
touchAreaSize: CssUnitOrRawValue = 12
minSpan: number = 0
trackColor: string = 'var(--v-color-surface)'
fillColor: string = 'var(--v-color-primary)'
barStyle: ProgressBarStyle = 'flat'   // 'flat' | 'raised' | 'inset'
```

## Events

- `valueChange: number`
- `rangeChange: [number, number]`

## Color Classes

Use `.v-primary`, `.v-danger`, or `.v-accent` to change fill and thumb color:

```html
<v-slider class="v-danger" [min]="0" [max]="100" [value]="value" (valueChange)="value = $event" />
```

## Examples (minimal but diverse)

```html
<!-- Squarish thumbs + touch area -->
<v-slider
  [min]="0"
  [max]="100"
  [isRange]="true"
  [thumbBorderRadius]="2"
  [thumbSize]="7"
  [isTouchMode]="true"
  [touchAreaSize]="12"
  [range]="range"
  (rangeChange)="range = $event" />

<!-- Discrete list (timestamps) -->
<v-slider
  [isRange]="true"
  [valueList]="dateValues"
  [range]="dateRange"
  (rangeChange)="dateRange = $event" />

<!-- Custom color -->
<v-slider
  class="v-accent"
  [min]="0"
  [max]="100"
  [value]="value"
  (valueChange)="value = $event" />
```
