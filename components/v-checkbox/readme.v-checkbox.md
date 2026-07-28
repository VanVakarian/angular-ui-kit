# V-Checkbox

Flat design checkbox with optional switch mode and smooth animations. Supports dark theme.

## Basic Usage

```html
<v-checkbox
  [value]="value"
  (valueChange)="value = $event">
  Receive updates
</v-checkbox>
```

## Switch Mode

```html
<v-checkbox
  mode="switch"
  [value]="enabled"
  (valueChange)="enabled = $event">
  Enable notifications
</v-checkbox>
```

## Properties

```ts
mode: 'checkbox' | 'switch' = 'checkbox'
isDisabled: boolean = false
labelPosition: 'left' | 'right' = 'right'
size: CssUnitValue = 6
borderRadius: CssUnitValue = 2
gap: CssUnitValue = 2
checkIconSize: CssUnitValue = 5
switchWidth: CssUnitValue = 14
switchHeight: CssUnitValue = 7
switchPadding: CssUnitValue = 1
thumbSize: CssUnitValue = 5
```

## Events

- `valueChange: boolean`
- `onChanged: boolean`
