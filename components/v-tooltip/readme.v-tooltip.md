# V-Tooltip

Floating panel shown on hover (desktop) or tap (touch). Positions itself above the trigger via `position: fixed`, flips below if there isn't enough room, and clamps horizontally to the viewport — so it stays visible even inside scroll/overflow containers like `v-expand` or `v-card`.

## Basic Usage

Two content slots: the default slot is the trigger, `[v-panel]` is the panel content — any markup, not just text.

```html
<v-tooltip>
  <v-icon [name]="IconName.Info" [size]="4" />
  <span v-panel>Plain-language explanation of what this value means.</span>
</v-tooltip>
```

```html
<v-tooltip>
  <span>Hover me</span>
  <div v-panel class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <span class="h-3 w-3 rounded-full bg-red-500"></span>
      <span>Over target</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="h-3 w-3 rounded-full bg-green-500"></span>
      <span>On target</span>
    </div>
  </div>
</v-tooltip>
```

## Properties

```ts
fill: boolean = false
maxWidth: string = '280px'
noWrap: boolean = false
```

## Behavior

- Hover/focus opens, mouse-leave/blur closes.
- On touch, closes the instant a new touch starts elsewhere (not on touchend) — so the panel, being `position: fixed`, never lingers detached from its trigger while the page is dragged/scrolled.
- Click is not intercepted — it passes through to whatever click handler sits on the trigger content or an ancestor (e.g. a clickable card the trigger lives inside).
- The panel itself is `pointer-events: none` — its content can't be interacted with, only viewed.
