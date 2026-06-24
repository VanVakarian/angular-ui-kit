# V-Tooltip

Floating text hint shown on hover (desktop) or tap (touch). Positions itself above the trigger via `position: fixed`, flips below if there isn't enough room, and clamps horizontally to the viewport — so it stays visible even inside scroll/overflow containers like `v-expand` or `v-card`.

## Basic Usage

```html
<v-tooltip text="Plain-language explanation of what this value means.">
  <v-icon [name]="IconName.Info" [size]="4" />
</v-tooltip>
```

## Properties

```ts
text: string       // required, the hint text
maxWidth: string = '280px'
```

## Behavior

- Desktop: hover/focus opens, mouse-leave/blur closes.
- Touch: tap toggles open/closed; tapping anywhere else closes it.
- Content projected into `<v-tooltip>` is the trigger element (usually an info icon).
