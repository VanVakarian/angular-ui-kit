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
text: string       // required, the hint text — `\n` renders as a line break
maxWidth: string = '280px'
```

## Behavior

- Hover/focus opens, mouse-leave/blur closes. That's the only thing that opens or closes it.
- Click is not intercepted — it passes through to whatever click handler sits on the trigger content or an ancestor (e.g. a clickable card the trigger lives inside).
- Content projected into `<v-tooltip>` is the trigger element — an icon, a label, any inline content.
