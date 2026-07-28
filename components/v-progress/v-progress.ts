import { Component, computed, input } from '@angular/core';
import { CssUnitValue } from '@ui-kit/types';

@Component({
  selector: 'v-progress',
  templateUrl: './v-progress.html',
  styleUrl: './v-progress.css',
  host: {
    '[style.--v-progress-height]': 'heightString$$()',
    '[style.--v-progress-border-radius]': 'borderRadiusString$$()',
    '[style.--v-progress-percentage]': 'percentage$$()',
    '[style.--v-progress-bar-color]': 'barColor()',
    '[style.--v-progress-bar-gap]': 'barGapString$$()',
    '[style.--v-progress-value]': 'value()',
  },
})
export class VProgress {
  public readonly value = input<number>(0);
  public readonly isShowValues = input<boolean>(false);
  public readonly min = input<number>(0);
  public readonly max = input<number>(100);
  public readonly height = input<CssUnitValue>(3);
  public readonly borderRadius = input<CssUnitValue>(2);
  public readonly barGap = input<number>(1);
  public readonly barColor = input<string>('var(--v-color-primary)');
  public readonly valueSuffix = input<string>('');

  protected readonly heightString$$ = computed(() => `var(--unit-${this.height()})`);
  protected readonly borderRadiusString$$ = computed(() => `var(--unit-${this.borderRadius()})`);
  protected readonly barGapString$$ = computed(() => `${this.barGap()}px`);

  protected readonly scaleMin$$ = computed(() => Math.min(this.min(), this.value()));

  protected readonly scaleMax$$ = computed(() => Math.max(this.max(), this.value()));

  protected readonly scaleRange$$ = computed(() => this.scaleMax$$() - this.scaleMin$$());

  protected readonly leftLabel$$ = computed(() => {
    const value = this.value();
    const min = this.min();
    return value < min ? value : min;
  });

  protected readonly leftLabelText$$ = computed(() => this.formatValue(this.leftLabel$$()));

  protected readonly leftLabelIsPrimary$$ = computed(() => this.leftLabel$$() === this.min());

  protected readonly rightLabel$$ = computed(() => {
    const value = this.value();
    const max = this.max();
    return value > max ? value : max;
  });

  protected readonly rightLabelText$$ = computed(() => this.formatValue(this.rightLabel$$()));

  protected readonly rightLabelIsPrimary$$ = computed(() => this.rightLabel$$() === this.max());

  protected readonly middleLabel$$ = computed(() => {
    const value = this.value();
    const min = this.min();
    const max = this.max();
    if (value < min) return min;
    if (value > max) return max;
    return null;
  });

  protected readonly middleLabelText$$ = computed(() => {
    const middle = this.middleLabel$$();
    return middle !== null ? this.formatValue(middle) : null;
  });

  protected readonly currentValueText$$ = computed(() => this.formatValue(this.value()));

  protected readonly shouldShowCurrentValue$$ = computed(() => {
    const value = this.value();
    return value !== this.leftLabel$$() && value !== this.rightLabel$$();
  });

  protected readonly percentage$$ = computed(() => {
    const percentage = this.calculatePercentage(this.value());
    return percentage < 3 && percentage > 0 ? '3%' : `${percentage}%`;
  });

  protected readonly valuePosition$$ = computed(() => {
    return this.calculateClampedPosition(this.value());
  });

  protected readonly middlePosition$$ = computed(() => {
    const middle = this.middleLabel$$();
    return middle !== null ? this.calculateClampedPosition(middle) : null;
  });

  private formatValue(value: number): string {
    return `${value}${this.valueSuffix()}`;
  }

  private calculatePercentage(value: number): number {
    const min = this.scaleMin$$();
    const range = this.scaleRange$$();
    if (range === 0) return 0;
    return ((value - min) / range) * 100;
  }

  private calculateClampedPosition(value: number): string {
    const percentage = this.calculatePercentage(value);
    const clampedPercentage = Math.max(10, Math.min(percentage, 90));
    return `${clampedPercentage}%`;
  }
}
