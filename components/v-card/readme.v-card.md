# V-Card Component Usage Examples

## Component Architecture

The component has the following structure:
```
:host (flat card container)
└── ng-content (projected content)
```

**Key Feature**: The flat styling with subtle borders is applied to the host element, creating a clean card appearance with smooth transitions.

## Basic Usage

```html
<v-card>
  Default card content
</v-card>
```

## Usage with Different Configurations

```html
<!-- Default card (borderRadius=2, padding=2) -->
<v-card>
  Default card with standard padding and border radius
</v-card>

<!-- Compact card -->
<v-card [borderRadius]="1" [padding]="1">
  Compact card with smaller values
</v-card>

<!-- Sharp corners card -->
<v-card [borderRadius]="0">
  Card without border radius
</v-card>

<!-- Large card -->
<v-card [borderRadius]="4" [padding]="6">
  Large card with bigger padding and border radius
</v-card>
```

## Usage with Content Projection

```html
<!-- Card with form elements -->
<v-card [padding]="4">
  <h2>User Form</h2>
  <v-input label="Username" placeholder="Enter your name" />
  <v-input label="Email" type="email" placeholder="example@email.com" />
  <button type="submit">Submit</button>
</v-card>

<!-- Card with mixed content -->
<v-card [borderRadius]="3" [padding]="3">
  <div class="card-header">
    <h3>Card Title</h3>
    <p>Card subtitle</p>
  </div>
  <div class="card-content">
    <p>This is the main content of the card.</p>
  </div>
  <div class="card-actions">
    <button>Action 1</button>
    <button>Action 2</button>
  </div>
</v-card>
```

## Available Properties

### Input Properties (Signal-based API)
- `borderRadius`: input<CssUnitValue>(2) - Border radius using CSS unit values (0-96)
- `padding`: input<CssUnitValue>(2) - Padding using CSS unit values (0-96)

### Output Events (Signal-based API)
- `onCardclick`: output<MouseEvent>() - Event fired when card is clicked

### CSS Unit Values
The component uses a predefined set of unit values that correspond to CSS variables:
- **0**: 0px
- **1**: 4px
- **2**: 8px (default)
- **3**: 12px
- **4**: 16px
- **5**: 20px
- **6**: 24px
- **8**: 32px
- **10**: 40px
- **12**: 48px
- **16**: 64px
- **20**: 80px
- **24**: 96px
- **32**: 128px
- **40**: 160px
- **48**: 192px
- **64**: 256px
- **80**: 320px
- **96**: 384px

## Interactive Card Examples

```html
<!-- Clickable card -->
<v-card (onCardclick)="handleCardClick($event)">
  Click me!
</v-card>

<!-- Card with hover effects (add custom CSS) -->
<v-card class="hover-card" [padding]="3">
  Hover over me for effects
</v-card>
```

```typescript
// In component:
export class ExampleComponent {
  handleCardClick(event: MouseEvent): void {
    console.log('Card clicked!', event);
    // Handle card click logic
  }
}
```

## Styling

The component uses flat design with subtle borders and smooth transitions:

### CSS Variables (from vars.css):
- **Spacing units**: `--unit-0` to `--unit-96` (from 0px to 384px)
- **Background**: `--v-color-surface`
- **Border**: `--v-color-border-subtle`
- **Transition**: `--v-card-transition-duration` (0.2s)

### Flat Design Effects:
- **Clean appearance**: Subtle border with flat background
- **Soft edges**: Customizable border radius
- **Flexible spacing**: Configurable padding
- **Smooth transitions**: Background and border color transitions
- **Dark mode support**: Adapts to theme changes

### Host Element Styling:
```css
:host {
  border-radius: var(--v-card-border-radius, var(--unit-2));
  padding: var(--v-card-padding, var(--unit-2));
  border: 1px solid var(--v-color-border-subtle);
  background: var(--v-color-surface);
  transition:
    background var(--v-card-transition-duration) ease,
    border-color var(--v-card-transition-duration) ease;
}
```

## Advanced Usage

### Custom Styling
```html
<!-- Card with custom CSS classes -->
<v-card class="custom-card special-border" [borderRadius]="2" [padding]="4">
  Custom styled card
</v-card>
```

```css
/* Custom styles in your component */
.custom-card {
  background: linear-gradient(120deg, #ebf2f9 19.14%, #c6d7eb 154.68%);
  transition: transform 0.2s ease;
}

.custom-card:hover {
  transform: translateY(-2px);
}
```

### Nested Cards
```html
<v-card [padding]="4">
  <h2>Parent Card</h2>
  <v-card [borderRadius]="1" [padding]="2">
    Nested card content
  </v-card>
</v-card>
```

## Best Practices

1. **Use consistent spacing**: Stick to the predefined unit values for consistency
2. **Consider content**: Adjust padding based on the type of content inside
3. **Responsive design**: Consider different padding values for different screen sizes
4. **Accessibility**: Ensure sufficient contrast and focus states for interactive cards
5. **Performance**: The component is lightweight and standalone, perfect for reuse

## Integration Notes

- **Standalone component**: Can be used independently without additional modules
- **Content projection**: Uses `<ng-content />` for maximum flexibility
- **Signal-based API**: Built with modern Angular signals for better performance
- **CSS custom properties**: Dynamically sets CSS variables for styling
- **Host binding**: Uses `@HostBinding` for efficient style application
