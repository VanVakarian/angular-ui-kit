# V-Progress

Neumorphic progress bar with unified config and three visual styles.

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
  barStyle?: ProgressBarStyle; // Flat | Raised | Inset
  barGap?: number;
  isShowValues?: boolean;
  valueSuffix?: string;
}
```

Defaults: `value=0`, `min=0`, `max=100`, `height=3`, `borderRadius=2`, `barColor='var(--v-color-primary)'`, `barStyle=Flat`, `barGap=1`, `isShowValues=false`, `valueSuffix=''`.

## Examples (minimal but diverse)

```html
<!-- Raised bar with custom height/color -->
<v-progress [config]="{
  value: 68,
  barStyle: ProgressBarStyle.Raised,
  height: 4,
  barColor: 'var(--v-color-success)'
}" />

<!-- Inset bar with value labels and suffix -->
<v-progress [config]="{
  value: 75,
  min: 0,
  max: 200,
  barStyle: ProgressBarStyle.Inset,
  isShowValues: true,
  valueSuffix: '%'
}" />
```
