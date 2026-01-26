# V-Progress

Flat design progress bar with unified config and custom color support.

## Basic Usage

```html
<v-progress [config]="{ value: 42, min: 0, max: 100 }" />
```

## Config API

```ts
interface VProgressConfig {
  value?: number;
  min?: number;
  max?: number;
  height?: CssUnitValue;
  borderRadius?: CssUnitValue;
  barColor?: string;
  barGap?: number;
  isShowValues?: boolean;
  valueSuffix?: string;
}
```

Defaults: `value=0`, `min=0`, `max=100`, `height=3`, `borderRadius=2`, `barColor='var(--v-color-primary)'`, `barGap=1`, `isShowValues=false`, `valueSuffix=''`.

## Color Classes

Use `.v-primary`, `.v-danger`, or `.v-accent` to change bar color:

```html
<v-progress class="v-danger" [config]="{ value: 75 }" />
```

Or use custom colors via config:

```html
<v-progress [config]="{ value: 50, barColor: 'green' }" />
<v-progress [config]="{ value: 75, barColor: '#EBACCA' }" />
```

## Examples (minimal but diverse)

```html
<!-- Custom color with value labels -->
<v-progress [config]="{
  value: 68,
  barColor: 'var(--v-color-success)',
  height: 4,
  isShowValues: true
}" />

<!-- Value labels with suffix -->
<v-progress [config]="{
  value: 75,
  min: 0,
  max: 200,
  isShowValues: true,
  valueSuffix: '%'
}" />
```
