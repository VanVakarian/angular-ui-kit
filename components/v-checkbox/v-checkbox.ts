import { Component, computed, input, model, output } from '@angular/core';
import { IconName, VIcon } from '@ui-kit/components/v-icon/v-icon';
import { CssUnitValue } from '@ui-kit/types';

export type VCheckboxMode = 'checkbox' | 'switch';

export interface VCheckboxConfig {
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

const DEFAULT_V_CHECKBOX_CONFIG: Required<VCheckboxConfig> = {
  label: '',
  isDisabled: false,
  mode: 'checkbox',
  size: 6,
  borderRadius: 2,
  gap: 2,
  checkIconSize: 4,
  switchWidth: 14,
  switchHeight: 7,
  switchPadding: 1,
  thumbSize: 5,
};

@Component({
  selector: 'v-checkbox',
  templateUrl: './v-checkbox.html',
  styleUrl: './v-checkbox.css',
  imports: [VIcon],
  host: {
    '[class.checked]': 'value()',
    '[class.disabled]': 'settings$$().isDisabled',
    '[attr.mode]': 'mode$$()',
    '[style.--v-checkbox-size]': 'sizeString$$()',
    '[style.--v-checkbox-border-radius]': 'borderRadiusString$$()',
    '[style.--v-checkbox-gap]': 'gapString$$()',
    '[style.--v-checkbox-check-size]': 'checkIconSizeString$$()',
    '[style.--v-checkbox-switch-width]': 'switchWidthString$$()',
    '[style.--v-checkbox-switch-height]': 'switchHeightString$$()',
    '[style.--v-checkbox-switch-padding]': 'switchPaddingString$$()',
    '[style.--v-checkbox-thumb-size]': 'thumbSizeString$$()',
  },
})
export class VCheckbox {
  public readonly config = input<VCheckboxConfig>({});
  public readonly value = model<boolean>(false);
  public readonly onChanged = output<boolean>();

  protected readonly Icon = IconName;

  protected readonly settings$$ = computed(() => ({
    ...DEFAULT_V_CHECKBOX_CONFIG,
    ...this.config(),
  }));

  protected readonly mode$$ = computed(() => this.settings$$().mode);
  protected readonly isSwitch$$ = computed(() => this.mode$$() === 'switch');

  protected readonly sizeString$$ = computed(() => `var(--unit-${this.settings$$().size})`);
  protected readonly borderRadiusString$$ = computed(() => `var(--unit-${this.settings$$().borderRadius})`);
  protected readonly gapString$$ = computed(() => `var(--unit-${this.settings$$().gap})`);
  protected readonly checkIconSizeString$$ = computed(() => `var(--unit-${this.settings$$().checkIconSize})`);
  protected readonly switchWidthString$$ = computed(() => `var(--unit-${this.settings$$().switchWidth})`);
  protected readonly switchHeightString$$ = computed(() => `var(--unit-${this.settings$$().switchHeight})`);
  protected readonly switchPaddingString$$ = computed(() => `var(--unit-${this.settings$$().switchPadding})`);
  protected readonly thumbSizeString$$ = computed(() => `var(--unit-${this.settings$$().thumbSize})`);
  protected readonly checkIconSize$$ = computed(() => this.settings$$().checkIconSize);

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (this.settings$$().isDisabled) {
      target.checked = this.value();
      return;
    }

    this.value.set(target.checked);
    this.onChanged.emit(target.checked);
  }
}
