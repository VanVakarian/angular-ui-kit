# V-Input

Flat design input with unified config API, forms integration and prefix/postfix content projection. Supports dark theme.

## Basic Usage

```html
<v-input
  [config]="{ label: 'Username', placeholder: 'Enter your name' }"
  formControlName="username"
/>
```

## Config API

```ts
interface VInputConfig {
  isDisabled?: boolean;
  isReadonly?: boolean;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';
  inputmode?: 'none' | 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'search';
  pattern?: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  name?: string;
  fontSize?: string;
  fontWeight?: number;
  textAlign?: 'left' | 'right' | 'center';
  borderRadius?: CssUnitValue;
  isTextarea?: boolean;
  rows?: number;
  cols?: number;
  isAutoSubmitEnabled?: boolean;
  autoSubmitDelay?: number;
  autoSubmitResult?: VInputAutoSubmitResult | null;
}
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
  [config]="{
    type: 'email',
    label: 'Email Address',
    placeholder: 'user@example.com'
  }" />

<!-- Password with custom style -->
<v-input
  formControlName="password"
  [config]="{
    type: 'password',
    label: 'Password',
    fontSize: '1.1rem',
    fontWeight: 500
  }" />

<!-- Number with prefix/postfix -->
<v-input
  formControlName="price"
  [config]="{
    type: 'number',
    textAlign: 'right',
    fontSize: '18px'
  }">
  <span v-prefix>$</span>
  <select v-postfix>
    <option>USD</option>
    <option>EUR</option>
  </select>
</v-input>

<!-- Search with buttons -->
<v-input
  formControlName="search"
  [config]="{ placeholder: 'Type to search...' }">
  <button v-prefix type="button" (click)="clearSearch()">✕</button>
  <button v-postfix type="button" (click)="performSearch()">🔍</button>
</v-input>

<!-- Auto submit -->
<v-input
  [config]="{
    label: 'Auto submit',
    isAutoSubmitEnabled: true,
    autoSubmitDelay: 1500,
    autoSubmitResult: autoSubmitResult
  }"
  (onAutoSubmit)="handleAutoSubmit($event)" />
```
