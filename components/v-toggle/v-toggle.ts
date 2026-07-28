import { Component, computed, input, model, output } from '@angular/core';
import { VButton } from '@ui-kit/components/v-button/v-button';
import { VCard } from '@ui-kit/components/v-card/v-card';
import { CssUnitValue } from '@ui-kit/types';

export interface VToggleItem {
  id: string;
  label: string;
  isDisabled?: boolean;
}

@Component({
  selector: 'v-toggle',
  templateUrl: './v-toggle.html',
  styleUrl: './v-toggle.css',
  imports: [VCard, VButton],
  host: {
    '[style.--v-toggle-gap]': 'gapString$$()',
    '[class.v-toggle-fit-host]': 'fitContent()',
  },
})
export class VToggle {
  public readonly items = input<VToggleItem[]>([]);
  public readonly isMultiple = input<boolean>(false);
  public readonly isDisabled = input<boolean>(false);
  public readonly fitContent = input<boolean>(false);
  public readonly borderRadius = input<CssUnitValue>(2);
  public readonly padding = input<CssUnitValue>(1);
  public readonly gap = input<CssUnitValue>(1);
  public readonly activeClass = input<string>('v-primary');
  public readonly inactiveClass = input<string>('v-flat');

  public readonly value = model<string[]>([]);
  public readonly onChanged = output<string[]>();

  protected readonly gapString$$ = computed(() => `var(--unit-${this.gap()})`);

  protected onToggleClick(item: VToggleItem): void {
    if (this.isItemDisabled(item)) return;

    const current = this.value();
    const isSelected = current.includes(item.id);
    let nextValue: string[];

    if (this.isMultiple()) {
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
    return this.isDisabled() || !!item.isDisabled;
  }

  protected getButtonClass(item: VToggleItem): string {
    return this.isItemActive(item) ? this.activeClass() : this.inactiveClass();
  }
}
