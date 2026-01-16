import { Component, computed, ElementRef, inject, input, output } from '@angular/core';
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
  gap?: CssUnitValue;
  isDisabled?: boolean;
  isWithoutShadow?: boolean;
  bgOpacity?: '0' | '1' | `0.${number}`;
  isLabelHidden?: boolean;
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
  gap: 2,
  isDisabled: false,
  isWithoutShadow: false,
  bgOpacity: '1',
  isLabelHidden: false,
  textAlign: undefined as unknown as 'left' | 'center' | 'right',
} as const;

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
    '[attr.primary]': 'isPrimary$$() ? "" : null',
    '[attr.raised]': 'isRaised$$() ? "" : null',
    '[attr.flat]': 'isFlat$$() ? "" : null',
    '[attr.danger]': 'isDanger$$() ? "" : null',
    '[attr.no-shadow]': 'settings$$().isWithoutShadow ? "" : null',
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

  protected readonly isFlat$$ = computed(() => this.getActiveStyle() === ButtonStyle.Flat);
  protected readonly isRaised$$ = computed(() => this.getActiveStyle() === ButtonStyle.Raised);
  protected readonly isPrimary$$ = computed(() => this.getActiveStyle() === ButtonStyle.Primary);
  protected readonly isDanger$$ = computed(() => this.getActiveStyle() === ButtonStyle.Danger);

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
}
