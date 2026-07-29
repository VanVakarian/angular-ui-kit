# V-Input

Flat design input with individual property API, forms integration and prefix/postfix content projection. Supports dark theme.

## Basic Usage

```html
<v-input
  label="Username"
  placeholder="Enter your name"
  formControlName="username"
/>
```

## Properties

```ts
type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' = 'text'
inputmode: 'none' | 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'search' = 'text'
name: string
label: string
labelRight: string
placeholder: string
isDisabled: boolean = false
isReadonly: boolean = false
isClickable: boolean = false
isTextarea: boolean = false
pattern: string
errorMessage: string
inputSize: number | null
borderRadius: CssUnitOrRawValue = 2
paddingX: CssUnitOrRawValue = 0
paddingY: CssUnitOrRawValue = 2
rows: number = 3
cols: number = 50
fontSize: string = '1rem'
fontWeight: number = 400
textAlign: 'left' | 'right' | 'center' = 'left'
isAutoSubmitEnabled: boolean = false
autoSubmitDelay: number = 2000
autoSubmitResult: VInputAutoSubmitResult | null
autoSubmitResultFadeDuration: number = 3000
```

## Events

- `onInputChanged: Event`
- `onFocused: Event`
- `onBlurred: Event`
- `onEnterPressed: KeyboardEvent`
- `onAutoSubmit: string | number | null`

## Examples

```html
<!-- Email with validation -->
<v-input
  formControlName="email"
  type="email"
  label="Email Address"
  placeholder="user@example.com" />

<!-- Password with custom style -->
<v-input
  formControlName="password"
  type="password"
  label="Password"
  fontSize="1.1rem"
  [fontWeight]="500" />

<!-- Number with prefix/postfix -->
<v-input
  formControlName="price"
  type="number"
  textAlign="right"
  fontSize="18px">
  <span v-prefix>$</span>
  <select v-postfix>
    <option>USD</option>
    <option>EUR</option>
  </select>
</v-input>

<!-- Search with buttons -->
<v-input
  formControlName="search"
  placeholder="Type to search...">
  <button v-prefix type="button" (click)="clearSearch()">✕</button>
  <button v-postfix type="button" (click)="performSearch()">🔍</button>
</v-input>

<!-- Auto submit -->
<v-input
  label="Auto submit"
  [isAutoSubmitEnabled]="true"
  [autoSubmitDelay]="1500"
  [autoSubmitResult]="autoSubmitResult"
  (onAutoSubmit)="handleAutoSubmit($event)" />
```
