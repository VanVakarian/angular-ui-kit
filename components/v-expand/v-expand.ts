import { Component, computed, effect, input, output, signal } from '@angular/core';
import { CssUnitValue } from '@ui-kit/types';
import { AccordionItemPosition } from './v-accordion';

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
    '[class.accordion-item]': 'isInAccordion$$()',
    '[class.accordion-first]': 'accordionPosition$$()?.isFirst',
    '[class.accordion-last]': 'accordionPosition$$()?.isLast',
    '[class.accordion-middle]': 'isAccordionMiddle$$()',
    '[class.collapsed]': '!isPanelExpanded$$()',
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

  protected readonly accordionPosition$$ = signal<AccordionItemPosition | null>(null);

  protected readonly isInAccordion$$ = computed(() => this.accordionPosition$$() !== null);

  protected readonly isAccordionMiddle$$ = computed(() => {
    const pos = this.accordionPosition$$();
    return pos !== null && !pos.isFirst && !pos.isLast;
  });

  protected readonly isPanelExpanded$$ = computed(() => {
    const accordionPos = this.accordionPosition$$();
    if (accordionPos) {
      return accordionPos.isOpen();
    }
    return this._isExpanded$$();
  });

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
    if (!this.isInAccordion$$()) {
      const current = this._isExpanded$$();
      this.onOpened.emit(new CustomEvent('opened', { detail: current }));
    }
  });

  private readonly syncIsExpandedEffect$$ = effect(() => {
    const external = this.isExpanded();
    this._isExpanded$$.set(external);
  });

  public setExpanded(state: boolean): void {
    const accordionPos = this.accordionPosition$$();

    if (accordionPos) {
      const currentState = accordionPos.isOpen();
      if (currentState !== state) {
        accordionPos.toggle();
      }
    } else {
      this._isExpanded$$.set(state);
    }
  }

  public isPanelExpanded(): boolean {
    return this.isPanelExpanded$$();
  }

  protected toggle(): void {
    const accordionPos = this.accordionPosition$$();
    if (accordionPos) {
      accordionPos.toggle();
    } else {
      this._isExpanded$$.set(!this._isExpanded$$());
    }
  }

  public registerInAccordion(position: AccordionItemPosition): void {
    this.accordionPosition$$.set(position);
  }

  public notifyStateChange(isOpen: boolean): void {
    this.onOpened.emit(new CustomEvent('opened', { detail: isOpen }));
  }
}
