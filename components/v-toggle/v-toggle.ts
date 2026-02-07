import { Component, computed, input, model, output } from '@angular/core';
import { VButton, VButtonConfig } from '@ui-kit/components/v-button/v-button';
import { VCard, VCardConfig } from '@ui-kit/components/v-card/v-card';
import { CssUnitValue } from '@ui-kit/types';

export interface VToggleItem {
  id: string;
  label: string;
  isDisabled?: boolean;
}

export interface VToggleConfig {
  isMultiple?: boolean;
  isDisabled?: boolean;
  activeClass?: string;
  inactiveClass?: string;
  borderRadius?: CssUnitValue;
  padding?: CssUnitValue;
  gap?: CssUnitValue;
  buttonConfig?: VButtonConfig;
}

const DEFAULT_V_TOGGLE_CONFIG: Required<VToggleConfig> = {
  isMultiple: false,
  isDisabled: false,
  activeClass: 'v-primary',
  inactiveClass: 'v-flat',
  borderRadius: 2,
  padding: 1,
  gap: 1,
  buttonConfig: {},
};

@Component({
  selector: 'v-toggle',
  templateUrl: './v-toggle.html',
  styleUrl: './v-toggle.css',
  imports: [VCard, VButton],
  host: {
    '[style.--v-toggle-gap]': 'gapString$$()',
  },
})
export class VToggle {
  public readonly items = input<VToggleItem[]>([]);
  public readonly config = input<VToggleConfig>({});
  public readonly value = model<string[]>([]);
  public readonly onChanged = output<string[]>();

  protected readonly settings$$ = computed(() => ({
    ...DEFAULT_V_TOGGLE_CONFIG,
    ...this.config(),
  }));

  protected readonly gapString$$ = computed(() => `var(--unit-${this.settings$$().gap})`);

  protected readonly cardConfig$$ = computed<VCardConfig>(() => ({
    borderRadius: this.settings$$().borderRadius,
    padding: this.settings$$().padding,
  }));

  protected readonly buttonConfig$$ = computed<VButtonConfig>(() => {
    const buttonConfig = this.settings$$().buttonConfig || {};
    return {
      width: '100%',
      padding: 1,
      ...buttonConfig,
    };
  });

  protected onToggleClick(item: VToggleItem): void {
    if (this.isItemDisabled(item)) return;

    const current = this.value();
    const isSelected = current.includes(item.id);
    let nextValue: string[];

    if (this.settings$$().isMultiple) {
      nextValue = isSelected ? current.filter((id) => id !== item.id) : [...current, item.id];
    } else {
      nextValue = isSelected ? [] : [item.id];
    }

    this.value.set(nextValue);
    this.onChanged.emit(nextValue);
  }

  protected isItemActive(item: VToggleItem): boolean {
    return this.value().includes(item.id);
  }

  protected isItemDisabled(item: VToggleItem): boolean {
    return this.settings$$().isDisabled || !!item.isDisabled;
  }

  protected getButtonClass(item: VToggleItem): string {
    return this.isItemActive(item) ? this.settings$$().activeClass : this.settings$$().inactiveClass;
  }

  protected getItemButtonConfig(item: VToggleItem): VButtonConfig {
    const baseConfig = this.buttonConfig$$();
    if (!this.isItemDisabled(item)) return baseConfig;
    if (baseConfig.isDisabled) return baseConfig;

    return {
      ...baseConfig,
      isDisabled: true,
    };
  }
}
