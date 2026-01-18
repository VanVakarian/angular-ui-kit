# V-Checkbox

Neumorphic checkbox with optional switch mode and simple check animation.

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
  [config]="{ mode: 'switch' }"
  [value]="enabled"
  (valueChange)="enabled = $event">
  Enable notifications
</v-checkbox>
```

## Config API

```ts
type VCheckboxMode = 'checkbox' | 'switch';
type VCheckboxLabelPosition = 'left' | 'right';

interface VCheckboxConfig {
  labelPosition?: VCheckboxLabelPosition;
  isDisabled?: boolean;
  mode?: VCheckboxMode;
  size?: CssUnitValue;
  borderRadius?: CssUnitValue;
  gap?: CssUnitValue;
  checkIconSize?: CssUnitValue;
  switchWidth?: CssUnitValue;
  switchHeight?: CssUnitValue;
  switchPadding?: CssUnitValue;
  thumbSize?: CssUnitValue;
}
```

Defaults: `labelPosition='right'`, `isDisabled=false`, `mode='checkbox'`, `size=6`, `borderRadius=2`, `gap=2`, `checkIconSize=4`, `switchWidth=14`, `switchHeight=7`, `switchPadding=1`, `thumbSize=5`.

## Events

- `valueChange: boolean`
- `onChanged: boolean`
