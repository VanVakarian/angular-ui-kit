# angular-ui-kit

Shared Angular UI kit distributed as a git submodule.

## Live Demo 🚀

- https://vanvakarian.github.io/ui-kit-showcase/

## Installation

The library is expected to be mounted into the host Angular application as:

- path: `src/ui-kit`
- import alias: `@ui-kit/*`

### 1. Add the repository as a submodule

From the frontend project root:

```bash
git submodule add git@github.com:VanVakarian/angular-ui-kit.git src/ui-kit
```

Expected `.gitmodules` entry:

```ini
[submodule "src/ui-kit"]
    path = src/ui-kit
    url = git@github.com:VanVakarian/angular-ui-kit.git
```

Fresh clone must use:

```bash
git clone --recurse-submodules <your-repo-url>
```

Existing clone must use:

```bash
git submodule update --init --recursive
```

### 2. Configure TypeScript aliases

In the host project's `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@app/*": ["src/app/*"],
      "@ui-kit/*": ["src/ui-kit/*"]
    }
  }
}
```

`baseUrl` is required. Without it, `paths` will not resolve.

### 3. Configure Angular assets and styles

In `angular.json`, under `projects.<project-name>.architect.build.options`:

```json
{
  "assets": [
    {
      "glob": "**/*",
      "input": "src/ui-kit/icons",
      "output": "/ui-kit-assets/icons"
    }
  ],
  "styles": [
    "src/ui-kit/styles/vars.css",
    "src/ui-kit/styles/flat-style.css",
    "src/ui-kit/styles/flat-blue.css",
    "src/styles.css"
  ]
}
```

CSS order is mandatory.

If the project uses SCSS as its global styles file (`src/styles.scss`) and needs SCSS-specific syntax (`@use`, `@import` of `.scss` files), also add:

```json
"stylePreprocessorOptions": {
  "includePaths": ["src"]
}
```

`stylePreprocessorOptions.includePaths` is required for SCSS `@use` / `@import` paths to resolve from `src/` root.

### 4. Activate theme tokens on `body`

In `src/index.html`:

```html
<body v-style="flat-style"
      v-theme="flat-blue">
  <app-root></app-root>
</body>
```

Without these attributes, ui-kit theme variables are not applied.

### 5. Configure Tailwind in the host styles file

ui-kit components rely on Tailwind's **preflight** to strip browser-native styles (borders, outline, appearance) from `<button>` and other elements. Without it, a native black border appears around buttons in Safari and Chrome.

For **Tailwind v4** — use a plain `.css` file:

```css
/* src/styles.css */
@import 'tailwindcss';
```

The file **must be `.css`**, not `.scss`. If `@import 'tailwindcss'` is placed inside a `.scss` file, Sass processes it first and emits a deprecation warning because Sass `@import` is being removed in Dart Sass 3. PostCSS (which handles the Tailwind import) never gets to run it properly.

For **Tailwind v3** — `.scss` is fine:

```scss
/* src/styles.scss */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

To check which version is installed: `tailwindcss` entry in `package.json`. `^4.x` → v4. `^3.x` → v3.

## Property Ordering Convention

Every component exposes each setting as its own `input()` — never a single bag object. Within a component's Inputs section, properties are ordered by group, in this order:

1. **Identity/kind** — `type`, `mode`, `name`
2. **Content** — `label`, `labelRight`, `placeholder`, `text`, `message`, `items`, `presets`, `valueList`, `value` (for read-only value inputs, not `model()`)
3. **State flags** — `isDisabled`, `isReadonly`, `isRequired`, `isClickable`, `isSelected`, `isMultiple`, `isOpen`, `isTextarea`, `isRange`, `isTouchMode`, `fill`, `noWrap`
4. **Validation** — `errorMessage`, `pattern`
5. **Layout/sizing** — `width`, `height`, `size`, `min`, `max`, `borderRadius`, `padding`, `paddingX`, `paddingY`, `gap`
6. **Visual/style** — `color`, `bgOpacity`, `textAlign`, `fontSize`, `fontWeight`, `trackColor`, `fillColor`, `barColor`, `thumbSize`, `thumbBorderRadius`
7. **Feature-specific trailing block** — a self-contained bundle of related properties for one feature, always at the very end, starting with its own enabling flag (example: all `autoSubmit*` properties on `v-input`)

Meta-rule on top of the groups: `input.required<T>()` properties always come before optional ones, regardless of group. Within the required and optional blocks, order follows the groups above.

Normalization: when a component exposes a `padding` shorthand alongside `paddingX`/`paddingY`, the order is always `padding` → `paddingX` → `paddingY`.

A component that wraps another ui-kit component (e.g. `v-dropdown` wrapping `v-input`, `v-toggle` wrapping `v-button`/`v-card`) exposes only the specific properties it actually needs to pass through as its own flat inputs — never a nested config object of the wrapped component's type.
