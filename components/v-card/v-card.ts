import { Component, computed, input, output } from '@angular/core';
import { CssUnitValue } from '@ui-kit/types';

@Component({
  selector: 'v-card',
  templateUrl: './v-card.html',
  styleUrl: './v-card.css',
  host: {
    '[style.--v-card-border-radius]': 'borderRadiusString$$()',
    '[style.--v-card-padding-x]': 'paddingXString$$()',
    '[style.--v-card-padding-y]': 'paddingYString$$()',
    '[style.backgroundImage]': 'cardBackgroundImage$$()',
    '[style.minHeight]': 'minHeight()',
    '[class.v-card-selected]': 'isSelected()',
  },
})
export class VCard {
  public readonly isSelected = input<boolean>(false);
  public readonly borderRadius = input<CssUnitValue>(4);
  public readonly padding = input<CssUnitValue>();
  public readonly paddingX = input<CssUnitValue>();
  public readonly paddingY = input<CssUnitValue>();
  public readonly minHeight = input<string>('auto');
  public readonly backgroundImageUrl = input<string | null>(null);
  public readonly backgroundImageOpacity = input<number>(1);

  public readonly onCardclick = output<MouseEvent>();

  protected readonly borderRadiusString$$ = computed(() => `var(--unit-${this.borderRadius()})`);
  protected readonly paddingX$$ = computed(() => this.paddingX() ?? this.padding() ?? 2);
  protected readonly paddingY$$ = computed(() => this.paddingY() ?? this.padding() ?? 2);
  protected readonly paddingXString$$ = computed(() => `var(--unit-${this.paddingX$$()})`);
  protected readonly paddingYString$$ = computed(() => `var(--unit-${this.paddingY$$()})`);

  protected readonly cardBackgroundImage$$ = computed(() => {
    const url = this.backgroundImageUrl();
    if (!url) return null;
    const opacity = this.backgroundImageOpacity();
    return `linear-gradient(rgba(255, 255, 255, ${opacity}), rgba(255, 255, 255, ${opacity})), url('${url}')`;
  });

  protected onClick(event: MouseEvent): void {
    this.onCardclick.emit(event);
  }
}
