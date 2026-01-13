import { Component, computed, effect, ElementRef, inject, input, output, signal } from '@angular/core';
import { ButtonStyle, CssUnitValue } from '@ui-kit/types';

type ButtonType = 'button' | 'submit' | 'reset';

export interface VButtonConfig {
  type?: ButtonType;
  buttonStyle?: ButtonStyle;
  width?: string;
  borderRadius?: CssUnitValue;
  padding?: CssUnitValue;
  paddingY?: CssUnitValue;
  paddingX?: CssUnitValue;
  margin?: CssUnitValue;
  marginY?: CssUnitValue;
  marginX?: CssUnitValue;
  gap?: CssUnitValue;
  isDisabled?: boolean;
  isWithoutShadow?: boolean;
  bgOpacity?: '0' | '1' | `0.${number}`;
  isLabelHidden?: boolean;
  labelAnimationDuration?: number;
  textAlign?: 'left' | 'center' | 'right';
}

const DEFAULT_V_BUTTON_CONFIG: Required<VButtonConfig> = {
  type: 'button',
  buttonStyle: undefined as unknown as ButtonStyle,
  width: undefined as unknown as string,
  borderRadius: 2,
  padding: undefined as unknown as CssUnitValue,
  paddingY: 2,
  paddingX: 4,
  margin: undefined as unknown as CssUnitValue,
  marginY: 0,
  marginX: 0,
  gap: 2,
  isDisabled: false,
  isWithoutShadow: false,
  bgOpacity: '1',
  isLabelHidden: false,
  labelAnimationDuration: 0,
  textAlign: undefined as unknown as 'left' | 'center' | 'right',
};

@Component({
  selector: `
    v-button,
    v-button[primary],
    v-button[raised],
    v-button[flat],
    v-button[danger],
    v-button[buttonStyle],
  `,
  templateUrl: './v-button.html',
  styleUrl: './v-button.css',
  host: {
    '[style.width]': 'settings$$().width || null',
    '[attr.primary]': 'isPrimary ? "" : null',
    '[attr.raised]': 'isRaised ? "" : null',
    '[attr.flat]': 'isFlat ? "" : null',
    '[attr.danger]': 'isDanger ? "" : null',
    '[attr.no-shadow]': 'settings$$().isWithoutShadow ? "" : null',
    '[style.--v-button-border-radius]': 'borderRadiusString$$()',
    '[style.--v-button-bg-opacity]': 'settings$$().bgOpacity',
    '[style.--v-button-padding-y]': 'paddingYString$$()',
    '[style.--v-button-padding-x]': 'paddingXString$$()',
    '[style.--v-button-margin-y]': 'marginYString$$()',
    '[style.--v-button-margin-x]': 'marginXString$$()',
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
  protected readonly marginY$$ = computed(() => this.getMarginY());
  protected readonly marginX$$ = computed(() => this.getMarginX());

  protected readonly onClick = output<MouseEvent>();

  protected readonly borderRadiusString$$ = computed(() => `var(--unit-${this.settings$$().borderRadius})`);
  protected readonly paddingYString$$ = computed(() => `var(--unit-${this.paddingY$$()})`);
  protected readonly paddingXString$$ = computed(() => `var(--unit-${this.paddingX$$()})`);
  protected readonly marginYString$$ = computed(() => `var(--unit-${this.marginY$$()})`);
  protected readonly marginXString$$ = computed(() => `var(--unit-${this.marginX$$()})`);
  protected readonly gapString$$ = computed(() => `var(--unit-${this.settings$$().gap})`);

  public get isFlat(): boolean {
    return this.getActiveStyle() === ButtonStyle.Flat;
  }

  public get isRaised(): boolean {
    return this.getActiveStyle() === ButtonStyle.Raised;
  }

  public get isPrimary(): boolean {
    return this.getActiveStyle() === ButtonStyle.Primary;
  }

  public get isDanger(): boolean {
    return this.getActiveStyle() === ButtonStyle.Danger;
  }

  private readonly elementRef = inject(ElementRef);

  protected onButtonClick(event: MouseEvent): void {
    if (this.settings$$().isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.onClick.emit(event);
  }

  private getActiveStyle(): ButtonStyle {
    const styleInput = this.settings$$().buttonStyle;
    if (styleInput) return styleInput;

    const element = this.elementRef.nativeElement;
    if (element.hasAttribute('primary')) return ButtonStyle.Primary;
    if (element.hasAttribute('raised')) return ButtonStyle.Raised;
    if (element.hasAttribute('flat')) return ButtonStyle.Flat;
    if (element.hasAttribute('danger')) return ButtonStyle.Danger;

    return ButtonStyle.Primary;
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

  private getMarginY(): CssUnitValue {
    const config = this.config();
    if (config.marginY !== undefined) return config.marginY;
    if (config.margin !== undefined) return config.margin;
    return this.settings$$().marginY;
  }

  private getMarginX(): CssUnitValue {
    const config = this.config();
    if (config.marginX !== undefined) return config.marginX;
    if (config.margin !== undefined) return config.margin;
    return this.settings$$().marginX;
  }

  // ======================================= LABEL VISIBILITY WITH ANIMATION ===

  /**
   * Animation state signals - control DOM presence and opacity independently for smooth transitions.
   */
  private readonly isLabelInDomAnimated$$ = signal(false);
  private readonly isLabelVisibleAnimated$$ = signal(false);

  /**
   * Controls whether label exists in DOM. True if visible or animating out.
   */
  protected readonly isLabelInDom$$ = computed(() => {
    const isHidden = this.settings$$().isLabelHidden;
    return !isHidden || this.isLabelInDomAnimated$$();
  });

  /**
   * Controls label opacity. True only when fully visible.
   */
  protected readonly isLabelVisible$$ = computed(() => {
    const isHidden = this.settings$$().isLabelHidden;
    return !isHidden && this.isLabelVisibleAnimated$$();
  });

  private labelAnimationTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isInitialLoad = true;

  /**
   * Label show/hide animation logic.
   *
   * WHY THIS EXISTS:
   * Label must be removed from DOM (not just hidden) to eliminate the gap flash
   * between label and prefix/postfix that appears due to flex gap.
   * Setting width:0 or opacity:0 alone is insufficient.
   *
   * BEHAVIOR:
   * - labelAnimationDuration = 0: instant show/hide
   * - labelAnimationDuration > 0: fade in/out with timed DOM add/remove
   * - Initial render: always instant (prevents animation flash on page load)
   *
   * SEQUENCE (when animated):
   * Hide: fade out → wait → remove from DOM
   * Show: add to DOM → wait 10ms → fade in
   */
  private readonly labelVisibilityEffect = effect(() => {
    if (this.labelAnimationTimeoutId) {
      clearTimeout(this.labelAnimationTimeoutId);
      this.labelAnimationTimeoutId = null;
    }

    const animationDuration = this.settings$$().labelAnimationDuration || 0;
    const shouldAnimate = animationDuration > 0 && !this.isInitialLoad;

    if (this.settings$$().isLabelHidden) {
      this.isInitialLoad = false;
      if (!shouldAnimate) {
        // No animation: instantly hide
        this.isLabelVisibleAnimated$$.set(false);
        this.isLabelInDomAnimated$$.set(false);
      } else {
        // With animation: fade out, then remove from DOM
        this.isLabelVisibleAnimated$$.set(false);
        this.labelAnimationTimeoutId = setTimeout(() => {
          this.isLabelInDomAnimated$$.set(false);
          this.labelAnimationTimeoutId = null;
        }, animationDuration);
      }
    } else {
      this.isInitialLoad = false;
      if (!shouldAnimate) {
        // No animation: instantly show
        this.isLabelInDomAnimated$$.set(true);
        this.isLabelVisibleAnimated$$.set(true);
      } else {
        // With animation: add to DOM, then fadset(true);
        this.isLabelVisibleAnimated$$.set(false);
        // Small delay to ensure DOM is updated before transition starts
        this.labelAnimationTimeoutId = setTimeout(() => {
          this.isLabelVisibleAnimated$$.set(true);
          this.labelAnimationTimeoutId = null;
        }, 10);
      }
    }
  });
}
