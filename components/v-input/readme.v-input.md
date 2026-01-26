# V-Input

Flat design input component with unified configuration API, form integration and content projection. Supports dark theme.

## Basic Usage

```html
<v-input
  [config]="{ label: 'Username', placeholder: 'Enter your name' }"
  formControlName="username"
/>
```

## Configuration API

All component settings are unified in a single `config` object:

```typescript
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
  fontSize?: string; // e.g. '1rem', '16px', '1.2em'
  fontWeight?: number; // 100-900
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

| Event | Type | Description |
|-------|------|-------------|
| `onInputChanged` | `Event` | Value changed |
| `onFocused` | `Event` | Input focused |
| `onBlurred` | `Event` | Input blurred |
| `onEnterPressed` | `KeyboardEvent` | Enter key pressed |
| `onAutoSubmit` | `string \| number \| null` | Auto submit triggered |

## Auto Submit Result

Use `VInputAutoSubmitResult` to report submission outcomes:

- `Success`
- `Error`

## Examples

### Simple Form with Various Types
```html
<form [formGroup]="form">
  <!-- Basic text input -->
  <v-input
    formControlName="username"
    [config]="{
      label: 'Username',
      placeholder: 'Enter your name'
    }" />

  <!-- Email with validation -->
  <v-input
    formControlName="email"
    [config]="{
      type: 'email',
      label: 'Email Address',
      placeholder: 'user@example.com'
    }" />

  <!-- Password with custom styling -->
  <v-input
    formControlName="password"
    [config]="{
      type: 'password',
      label: 'Password',
      placeholder: 'Enter password',
      fontSize: '1.1rem',
      fontWeight: 500
    }" />
</form>
```

### Advanced Configuration with Content Projection
```html
<!-- Number input with custom styling and currency -->
<v-input
  formControlName="price"
  [config]="{
    type: 'number',
    label: 'Product Price',
    placeholder: '0.00',
    textAlign: 'right',
    fontSize: '18px',
    fontWeight: 600
  }">
  <span v-prefix>$</span>
  <select v-postfix>
    <option>USD</option>
    <option>EUR</option>
  </select>
</v-input>

<!-- Search with interactive elements -->
<v-input
  formControlName="search"
  [config]="{
    type: 'text',
    label: 'Search Products',
    placeholder: 'Type to search...',
    fontSize: '1rem'
  }">
  <button v-prefix type="button" (click)="clearSearch()">✕</button>
  <button v-postfix type="button" (click)="performSearch()">�</button>
</v-input>
```

### Dynamic Configuration with State Management
```typescript
// Component
protected readonly inputConfig$$ = computed<VInputConfig>(() => ({
  type: 'tel',
  label: 'Phone Number',
  placeholder: this.isInternational() ? '+1 (555) 000-0000' : '(555) 000-0000',
  isDisabled: this.isLoading(),
  errorMessage: this.hasError() ? 'Invalid phone format' : '',
  fontSize: this.isMobile() ? '16px' : '14px',
  fontWeight: this.isImportant() ? 600 : 400
}));
```

```html
<!-- Template -->
<v-input
  formControlName="phone"
  [config]="inputConfig()">
  <span v-prefix>{{ countryCode() }}</span>
  <button v-postfix
          type="button"
          (click)="toggleCountrySelector()">
    🌍
  </button>
</v-input>
```

### Auto Submit
```html
<v-input
  [config]="{
    label: 'Auto submit input',
    placeholder: 'Type at least 3 characters',
    isAutoSubmitEnabled: true,
    autoSubmitDelay: 1500,
    autoSubmitResult: autoSubmitResult
  }"
  (onAutoSubmit)="handleAutoSubmit($event)" />
```

## Styling

The component uses flat design with subtle borders and smooth transitions:

### CSS Variables (from vars.css):
- **Spacing units**: `--unit-1` to `--unit-96` (from 4px to 384px)
- **Text colors**:
  - `--v-color-text` - main text
  - `--v-color-text-muted` - muted text
  - `--v-color-text-danger` - error text
- **Background**: `--v-color-surface`
- **Border**: `--v-color-border-subtle`
- **Transition**: `--v-input-transition-duration` (0.2s)
- **Auto submit colors**:
  - `--v-input-auto-submit-progress-color`
  - `--v-input-auto-submit-success-color`
  - `--v-input-auto-submit-error-color`

### States:
- **Normal state**: subtle border with flat background
- **Hover state**: darker border color
- **Focus state**: emphasized border color
- **Disabled state**: 0.4 opacity and disabled pointer events
- **Error state**: red error text below input
- **Auto submit states**: countdown, submitting, success, error (driven by theme vars)
- **Dark mode**: automatically adapts colors via `:host-context(.dark)`

## Angular Forms Integration

The component is fully compatible with Angular Reactive Forms and Template-driven Forms thanks to the ControlValueAccessor interface implementation.

### Implementation Features:
- Uses modern Angular Signal-based API
- Automatic browser autofill handling
- Support for all standard input attributes
- Built-in validation state support

## Content Projection API

### Prefix Slot
Add content before the input field:
```html
<v-input label="Price">
  <span v-prefix>$</span>
</v-input>
```

### Postfix Slot
Add content after the input field:
```html
<v-input label="Search">
  <button v-postfix type="button">🔍</button>
</v-input>
```

### Combined Usage
Use both prefix and postfix:
```html
<v-input label="Amount">
  <span v-prefix>$</span>
  <select v-postfix>
    <option>USD</option>
    <option>EUR</option>
  </select>
</v-input>
```

### Interactive Elements
Prefix and postfix can contain interactive elements:
```html
<v-input label="Password" type="password">
  <button v-postfix
          type="button"
          (click)="togglePasswordVisibility()">
    {{ showPassword ? '🙈' : '👁️' }}
  </button>
</v-input>
```

### Styling Guidelines
- Prefix and postfix elements should be styled individually as needed
- They are vertically centered within the input wrapper via align-items: center
- They replace input padding, ensuring minimum 8px spacing (var(--unit-2)) even when empty
- Input field takes all remaining space (flex: 1)
- Both are included within the bordered input frame

## Troubleshooting

### NG0201: No provider for NgControl
**Problem**: Component requires NgControl but is used without forms.
**Solution**: Use of `[formControl]` or `formControlName` is required.
