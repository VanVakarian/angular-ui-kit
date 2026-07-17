import { Component, computed, input, output } from '@angular/core';
import { CssUnitValue } from '@ui-kit/types';

export interface VCardConfig {
  borderRadius?: CssUnitValue;
  padding?: CssUnitValue;
  paddingX?: CssUnitValue;
  paddingY?: CssUnitValue;
  backgroundImageUrl?: string | null;
  backgroundImageOpacity?: number;
  minHeight?: string;
  isSelected?: boolean;
}

const DEFAULT_V_CARD_CONFIG: Required<VCardConfig> = {
  borderRadius: 4,
  padding: undefined as unknown as CssUnitValue,
  paddingX: 2,
  paddingY: 2,
  backgroundImageUrl: null,
  backgroundImageOpacity: 1,
  minHeight: 'auto',
  isSelected: false,
};

@Component({
  selector: 'v-card',
  templateUrl: './v-card.html',
  styleUrl: './v-card.css',
  host: {
    '[style.--v-card-border-radius]': 'borderRadiusString$$()',
    '[style.--v-card-padding-x]': 'paddingXString$$()',
    '[style.--v-card-padding-y]': 'paddingYString$$()',
    '[style.backgroundImage]': 'cardBackgroundImage$$()',
    '[style.minHeight]': 'settings$$().minHeight',
    '[class.v-card-selected]': 'settings$$().isSelected',
  },
})
export class VCard {
  public readonly config = input<VCardConfig>({});

  public readonly onCardclick = output<MouseEvent>();

  protected readonly settings$$ = computed(() => ({
    ...DEFAULT_V_CARD_CONFIG,
    ...this.config(),
  }));

  protected readonly borderRadiusString$$ = computed(() => `var(--unit-${this.settings$$().borderRadius})`);
  protected readonly paddingX$$ = computed(() => this.getPaddingX());
  protected readonly paddingY$$ = computed(() => this.getPaddingY());
  protected readonly paddingXString$$ = computed(() => `var(--unit-${this.paddingX$$()})`);
  protected readonly paddingYString$$ = computed(() => `var(--unit-${this.paddingY$$()})`);

  protected readonly cardBackgroundImage$$ = computed(() => {
    const { backgroundImageUrl, backgroundImageOpacity } = this.settings$$();
    if (!backgroundImageUrl) return null;
    return `linear-gradient(rgba(255, 255, 255, ${backgroundImageOpacity}), rgba(255, 255, 255, ${backgroundImageOpacity})), url('${backgroundImageUrl}')`;
  });

  protected onClick(event: MouseEvent): void {
    this.onCardclick.emit(event);
  }

  private getPaddingX(): CssUnitValue {
    const config = this.config();
    if (config.paddingX !== undefined) return config.paddingX;
    if (config.padding !== undefined) return config.padding;
    return this.settings$$().paddingX;
  }

  private getPaddingY(): CssUnitValue {
    const config = this.config();
    if (config.paddingY !== undefined) return config.paddingY;
    if (config.padding !== undefined) return config.padding;
    return this.settings$$().paddingY;
  }
}
