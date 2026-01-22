import { Component, computed, ElementRef, inject, input, output, Renderer2 } from '@angular/core';
import { CssUnitValue } from '@ui-kit/types';

type ButtonType = 'button' | 'submit' | 'reset';

export interface VButtonConfig {
  type?: ButtonType;
  width?: string;
  borderRadius?: CssUnitValue;
  padding?: CssUnitValue;
  paddingY?: CssUnitValue;
  paddingX?: CssUnitValue;
  gap?: CssUnitValue;
  isDisabled?: boolean;
  isWithoutShadow?: boolean;
  bgOpacity?: '0' | '1' | `0.${number}`;
  isLabelHidden?: boolean;
  textAlign?: 'left' | 'center' | 'right';
}

const DEFAULT_V_BUTTON_CONFIG: Required<VButtonConfig> = {
  type: 'button',
  width: undefined as unknown as string,
  borderRadius: 2,
  padding: undefined as unknown as CssUnitValue,
  paddingY: 2,
  paddingX: 2,
  gap: 2,
  isDisabled: false,
  isWithoutShadow: false,
  bgOpacity: '1',
  isLabelHidden: false,
  textAlign: undefined as unknown as 'left' | 'center' | 'right',
} as const;

@Component({
  selector: 'v-button',
  templateUrl: './v-button.html',
  styleUrl: './v-button.css',
  host: {
    '[style.width]': 'settings$$().width || null',
    '[class.v-no-shadow]': 'settings$$().isWithoutShadow',
    '[style.--v-button-border-radius]': 'borderRadiusString$$()',
    '[style.--v-button-bg-opacity]': 'settings$$().bgOpacity',
    '[style.--v-button-padding-y]': 'paddingYString$$()',
    '[style.--v-button-padding-x]': 'paddingXString$$()',
    '[style.--v-button-gap]': 'gapString$$()',
    '[attr.text-align]': 'settings$$().textAlign || null',
    '[attr.aria-disabled]': 'settings$$().isDisabled ? "true" : "false"',
  },
})
export class VButton {
  public readonly config = input<VButtonConfig>({});
  public readonly tabindex = input<number | string | undefined>(undefined);

  protected readonly settings$$ = computed(() => ({
    ...DEFAULT_V_BUTTON_CONFIG,
    ...this.config(),
  }));

  protected readonly paddingY$$ = computed(() => this.getPaddingY());
  protected readonly paddingX$$ = computed(() => this.getPaddingX());

  protected readonly onClick = output<MouseEvent>();

  protected readonly borderRadiusString$$ = computed(() => `var(--unit-${this.settings$$().borderRadius})`);
  protected readonly paddingYString$$ = computed(() => `var(--unit-${this.paddingY$$()})`);
  protected readonly paddingXString$$ = computed(() => `var(--unit-${this.paddingX$$()})`);
  protected readonly gapString$$ = computed(() => `var(--unit-${this.settings$$().gap})`);

  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  protected onButtonClick(event: MouseEvent): void {
    if (this.settings$$().isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.onClick.emit(event);
  }

  protected onPointerDown(event: PointerEvent): void {
    if (this.settings$$().isDisabled || this.isLink()) return;
    const button = event.currentTarget as HTMLElement | null;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.createRipple(button, x, y, size);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (this.settings$$().isDisabled || this.isLink()) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const button = event.currentTarget as HTMLElement | null;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = rect.width / 2;
    const y = rect.height / 2;

    this.createRipple(button, x, y, size);
  }

  private isLink(): boolean {
    const element = this.elementRef.nativeElement as HTMLElement;
    return element.classList.contains('v-link');
  }

  private getPaddingY(): CssUnitValue {
    const config = this.config();
    if (config.paddingY !== undefined) return config.paddingY;
    if (config.padding !== undefined) return config.padding;
    return this.settings$$().paddingY;
  }

  private getPaddingX(): CssUnitValue {
    const config = this.config();
    if (config.paddingX !== undefined) return config.paddingX;
    if (config.padding !== undefined) return config.padding;
    return this.settings$$().paddingX;
  }

  private createRipple(button: HTMLElement, x: number, y: number, size: number): void {
    const ripple = this.renderer.createElement('span');
    this.renderer.addClass(ripple, 'v-button-ripple');
    this.renderer.setStyle(ripple, 'width', `${size}px`);
    this.renderer.setStyle(ripple, 'height', `${size}px`);
    this.renderer.setStyle(ripple, 'left', `${x - size / 2}px`);
    this.renderer.setStyle(ripple, 'top', `${y - size / 2}px`);
    this.renderer.setStyle(ripple, 'animation-duration', `${size * 1.5}ms`);

    this.renderer.appendChild(button, ripple);

    ripple.addEventListener(
      'animationend',
      () => {
        this.renderer.removeChild(button, ripple);
      },
      { once: true },
    );
  }
}
