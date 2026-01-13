# V-Expand Component

## Basic Usage

```html
<v-expand [expanded]="true">
  <div v-header>Header</div>
  <div v-body>Body content</div>
</v-expand>
```

## Accordion

### Click on header

```html
<v-expand accordion="my-group" accordionId="panel-1">
  <div v-header>Item 1</div>
  <div v-body>Content 1</div>
</v-expand>

<v-expand accordion="my-group" accordionId="panel-2">
  <div v-header>Item 2</div>
  <div v-body>Content 2</div>
</v-expand>
```

### External buttons

```typescript
private accordionService = inject(AccordionService);

openPanel() {
  this.accordionService.toggle('my-group', 'panel-1');
}
```

```html
<button (click)="openPanel()">Open Panel</button>

<v-expand accordion="my-group" accordionId="panel-1">
  <div v-body>Content</div>
</v-expand>
```

### Dynamic IDs

```html
@for (item of items; track item.id) {
  <v-expand [accordion]="'my-group'"
            [accordionId]="'item-' + item.id">
    <div v-header>{{ item.name }}</div>
    <div v-body>{{ item.content }}</div>
  </v-expand>
}
```

## Properties

- `borderRadius`: `input<CssUnitValue>(2)`
- `padding`: `input<CssUnitValue>(2)`
- `expanded`: `input<boolean>(false)`
- `accordion`: `input.required<string>()` - group name
- `accordionId`: `input.required<string>()` - unique panel ID

## Methods

- `toggle()`: void
- `setExpanded(expanded: boolean)`: void
