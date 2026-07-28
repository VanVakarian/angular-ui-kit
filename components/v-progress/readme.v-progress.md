# V-Progress

Flat design progress bar with individual property API and custom color support.

## Basic Usage

```html
<v-progress [value]="42" [min]="0" [max]="100" />
```

## Properties

```ts
value: number = 0
isShowValues: boolean = false
min: number = 0
max: number = 100
height: CssUnitValue = 3
borderRadius: CssUnitValue = 2
barGap: number = 1
barColor: string = 'var(--v-color-primary)'
valueSuffix: string = ''
```

## Color Classes

Use `.v-primary`, `.v-danger`, or `.v-accent` to change bar color:

```html
<v-progress class="v-danger" [value]="75" />
```

Or use a custom color via the `barColor` property:

```html
<v-progress [value]="50" barColor="green" />
<v-progress [value]="75" barColor="#EBACCA" />
```

## Examples (minimal but diverse)

```html
<!-- Custom color with value labels -->
<v-progress [value]="68"
            barColor="var(--v-color-success)"
            [height]="4"
            [isShowValues]="true" />

<!-- Value labels with suffix -->
<v-progress [value]="75"
            [min]="0"
            [max]="200"
            [isShowValues]="true"
            valueSuffix="%" />
```
