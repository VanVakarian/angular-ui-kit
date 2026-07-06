import { Component, computed, input, model, output } from '@angular/core';
import { CssUnitValue } from '@ui-kit/types';

export interface VColorPickerConfig {
  presets?: string[];
  swatchSize?: CssUnitValue;
  gap?: CssUnitValue;
}

const DEFAULT_PRESETS: string[] = [
  '#495057',
  '#E03131',
  '#F08C00',
  '#F5C518',
  '#2F9E44',
  '#0CA678',
  '#1971C2',
  '#4C6EF5',
  '#7048E8',
  '#AE3EC9',
  '#E64980',
  '#868E96',
];

const DEFAULT_V_COLOR_PICKER_CONFIG: Required<VColorPickerConfig> = {
  presets: DEFAULT_PRESETS,
  swatchSize: 6,
  gap: 2,
};

@Component({
  selector: 'v-color-picker',
  templateUrl: './v-color-picker.html',
  styleUrl: './v-color-picker.css',
  host: {
    '[style.--v-color-picker-swatch-size]': 'swatchSizeString$$()',
    '[style.--v-color-picker-gap]': 'gapString$$()',
  },
})
export class VColorPicker {
  public readonly config = input<VColorPickerConfig>({});
  public readonly value = model<string | null>(null);
  public readonly onChanged = output<string | null>();

  protected readonly settings$$ = computed(() => ({
    ...DEFAULT_V_COLOR_PICKER_CONFIG,
    ...this.config(),
  }));

  protected readonly presets$$ = computed(() => this.settings$$().presets);
  protected readonly swatchSizeString$$ = computed(() => `var(--unit-${this.settings$$().swatchSize})`);
  protected readonly gapString$$ = computed(() => `var(--unit-${this.settings$$().gap})`);
  protected readonly customColorValue$$ = computed(() => this.value() ?? '#000000');

  protected selectPreset(color: string): void {
    this.value.set(color);
    this.onChanged.emit(color);
  }

  protected onCustomColorChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChanged.emit(target.value);
  }
}
