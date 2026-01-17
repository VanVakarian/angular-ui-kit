# V-Checkbox

Neumorphic checkbox with optional switch mode and simple check animation.

## Basic Usage

```html
<v-checkbox
  [config]="{ label: 'Receive updates' }"
  [value]="value"
  (valueChange)="value = $event" />
```

## Switch Mode

```html
<v-checkbox
  [config]="{ mode: 'switch', label: 'Enable notifications' }"
  [value]="enabled"
  (valueChange)="enabled = $event" />
```

## Config API

```ts
type VCheckboxMode = 'checkbox' | 'switch';

interface VCheckboxConfig {
  label?: string;
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

Defaults: `label=''`, `isDisabled=false`, `mode='checkbox'`, `size=6`, `borderRadius=2`, `gap=2`, `checkIconSize=4`, `switchWidth=14`, `switchHeight=7`, `switchPadding=1`, `thumbSize=5`.

## Events

- `valueChange: boolean`
- `onChanged: boolean`
