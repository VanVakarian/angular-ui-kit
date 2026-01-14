import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CssUnitValue } from '@ui-kit/types';

export interface VExpandConfig {
  padding?: CssUnitValue;
  borderRadius?: CssUnitValue;
  animationTimingFunction?: 'ease-in-out' | 'linear' | 'ease' | 'ease-in' | 'ease-out';
  isWithoutAnimation?: boolean;
}

const DEFAULT_V_EXPAND_CONFIG: Required<VExpandConfig> = {
  padding: 2,
  borderRadius: 2,
  animationTimingFunction: 'ease-in-out',
  isWithoutAnimation: false,
};

@Component({
  selector: 'v-expand',
  templateUrl: './v-expand.html',
  styleUrl: './v-expand.css',
  host: {
    '[style.--v-expand-padding]': 'paddingString$$()',
    '[style.--v-expand-border-radius]': 'borderRadiusString$$()',
    '[style.--v-expand-animation-timing-function]': 'animationTimingFunction$$()',
    '[class.no-transition]': 'config$$().isWithoutAnimation',
  },
})
export class VExpand {
  public readonly config = input<VExpandConfig>({});
  public readonly isExpanded = input<boolean>(false);

  public readonly onOpened = output<CustomEvent<boolean>>();

  protected readonly config$$ = computed(() => ({
    ...DEFAULT_V_EXPAND_CONFIG,
    ...this.config(),
  }));

  public readonly paddingString$$ = computed(() => {
    const padding = this.config$$().padding;
    return `var(--unit-${padding})`;
  });

  public readonly borderRadiusString$$ = computed(() => {
    const borderRadius = this.config$$().borderRadius;
    return `var(--unit-${borderRadius})`;
  });

  public readonly animationTimingFunction$$ = computed(() => {
    return this.config$$().animationTimingFunction;
  });

  private readonly _isExpanded$$ = signal(false);

  private readonly onExpandedChangeEmitEffect$$ = effect(() => {
    const current = this._isExpanded$$();
    this.onOpened.emit(new CustomEvent('opened', { detail: current }));
  });

  private readonly syncIsExpandedEffect$$ = effect(() => {
    const external = this.isExpanded();
    this._isExpanded$$.set(external);
  });

  public setExpanded(state: boolean): void {
    this._isExpanded$$.set(state);
  }

  public isPanelExpanded(): boolean {
    return this._isExpanded$$();
  }

  protected toggle(): void {
    this._isExpanded$$.set(!this._isExpanded$$());
  }
}
