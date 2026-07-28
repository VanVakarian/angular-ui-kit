import { Component, computed, input, model, output } from '@angular/core';
import { IconName, VIcon } from '@ui-kit/components/v-icon/v-icon';
import { CssUnitValue } from '@ui-kit/types';

export type VCheckboxMode = 'checkbox' | 'switch';

export type VCheckboxLabelPosition = 'left' | 'right';

@Component({
  selector: 'v-checkbox',
  templateUrl: './v-checkbox.html',
  styleUrl: './v-checkbox.css',
  imports: [VIcon],
  host: {
    '[class.checked]': 'value()',
    '[class.disabled]': 'isDisabled()',
    '[attr.mode]': 'mode()',
    '[attr.label-position]': 'labelPosition()',
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
  public readonly mode = input<VCheckboxMode>('checkbox');
  public readonly isDisabled = input<boolean>(false);
  public readonly labelPosition = input<VCheckboxLabelPosition>('right');
  public readonly size = input<CssUnitValue>(6);
  public readonly borderRadius = input<CssUnitValue>(2);
  public readonly gap = input<CssUnitValue>(2);
  public readonly checkIconSize = input<CssUnitValue>(5);
  public readonly switchWidth = input<CssUnitValue>(14);
  public readonly switchHeight = input<CssUnitValue>(7);
  public readonly switchPadding = input<CssUnitValue>(1);
  public readonly thumbSize = input<CssUnitValue>(5);

  public readonly value = model<boolean>(false);
  public readonly onChanged = output<boolean>();

  protected readonly Icon = IconName;

  protected readonly isSwitch$$ = computed(() => this.mode() === 'switch');

  protected readonly sizeString$$ = computed(() => `var(--unit-${this.size()})`);
  protected readonly borderRadiusString$$ = computed(() => `var(--unit-${this.borderRadius()})`);
  protected readonly gapString$$ = computed(() => `var(--unit-${this.gap()})`);
  protected readonly checkIconSizeString$$ = computed(() => `var(--unit-${this.checkIconSize()})`);
  protected readonly switchWidthString$$ = computed(() => `var(--unit-${this.switchWidth()})`);
  protected readonly switchHeightString$$ = computed(() => `var(--unit-${this.switchHeight()})`);
  protected readonly switchPaddingString$$ = computed(() => `var(--unit-${this.switchPadding()})`);
  protected readonly thumbSizeString$$ = computed(() => `var(--unit-${this.thumbSize()})`);

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (this.isDisabled()) {
      target.checked = this.value();
      return;
    }

    this.value.set(target.checked);
    this.onChanged.emit(target.checked);
  }
}
