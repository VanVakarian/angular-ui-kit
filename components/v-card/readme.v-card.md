# V-Card

Flat design card component with configurable spacing and borders. Supports dark theme.

## Basic Usage

```html
<v-card>
  Card content
</v-card>
```

## With Configuration

```html
<!-- Compact card -->
<v-card [borderRadius]="1" [padding]="1">
  Compact
</v-card>

<!-- Sharp corners -->
<v-card [borderRadius]="0">
  No border radius
</v-card>

<!-- Large card -->
<v-card [borderRadius]="4" [padding]="6">
  Large spacing
</v-card>
```

## With Content

```html
<!-- Form card -->
<v-card [padding]="4">
  <h2>User Form</h2>
  <v-input label="Username" placeholder="Enter your name" />
  <v-input label="Email" type="email" />
  <button type="submit">Submit</button>
</v-card>

<!-- Clickable card -->
<v-card (onCardclick)="handleClick($event)">
  Click me!
</v-card>

<!-- Selected card with background image -->
<v-card [isSelected]="true"
        [backgroundImageUrl]="'/images/bg.jpg'"
        [backgroundImageOpacity]="0.6">
  Featured
</v-card>
```

## Properties

```ts
isSelected: boolean = false
borderRadius: CssUnitValue = 4     // 0-96
padding: CssUnitValue              // shorthand, fills paddingX/paddingY unless set
paddingX: CssUnitValue = 2
paddingY: CssUnitValue = 2
minHeight: string = 'auto'
backgroundImageUrl: string | null = null
backgroundImageOpacity: number = 1
```

## Events

- `onCardclick: MouseEvent`
