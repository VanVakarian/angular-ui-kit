import { Component, computed, effect, ElementRef, input, model, signal, viewChild } from '@angular/core';
import { ProgressBarStyle } from '@ui-kit/components/types';
import { CssUnitValue } from '@ui-kit/types';

export type VSliderRangeValue = [number, number];

type ActiveThumb = 'start' | 'end';

export interface VSliderConfig {
  min?: number;
  max?: number;
  height?: CssUnitValue;
  borderRadius?: CssUnitValue;
  thumbBorderRadius?: CssUnitValue | 'full';
  trackColor?: string;
  fillColor?: string;
  barStyle?: ProgressBarStyle;
  thumbSize?: CssUnitValue;
  isRange?: boolean;
}

const DEFAULT_V_SLIDER_CONFIG: Required<VSliderConfig> = {
  min: 0,
  max: 100,
  height: 3,
  borderRadius: 2,
  thumbBorderRadius: 'full',
  trackColor: 'var(--v-color-surface)',
  fillColor: 'var(--v-color-accent)',
  barStyle: ProgressBarStyle.Flat,
  thumbSize: 6,
  isRange: false,
};

@Component({
  selector: 'v-slider',
  templateUrl: './v-slider.html',
  styleUrl: './v-slider.css',
  host: {
    '[style.--v-slider-height]': 'heightString$$()',
    '[style.--v-slider-border-radius]': 'borderRadiusString$$()',
    '[style.--v-slider-track-color]': 'trackColor$$()',
    '[style.--v-slider-fill-color]': 'fillColor$$()',
    '[style.--v-slider-thumb-size]': 'thumbSizeString$$()',
    '[style.--v-slider-thumb-border-radius]': 'thumbBorderRadiusString$$()',
    '[style.--v-slider-fill-radius]': 'fillRadiusString$$()',
    '[style.--v-slider-fill-start]': 'fillStart$$()',
    '[style.--v-slider-fill-end]': 'fillEnd$$()',
    '[attr.bar-style]': 'barStyle$$()',
  },
})
export class VSlider {
  public readonly config = input<VSliderConfig>({});

  public readonly value = model<number>(0);
  public readonly range = model<VSliderRangeValue>([0, 100]);

  protected readonly rootElement = viewChild.required<ElementRef<HTMLDivElement>>('root');
  protected readonly trackElement = viewChild.required<ElementRef<HTMLDivElement>>('track');

  protected readonly settings$$ = computed(() => ({
    ...DEFAULT_V_SLIDER_CONFIG,
    ...this.config(),
  }));

  protected readonly min$$ = computed(() => Math.min(this.settings$$().min, this.settings$$().max));
  protected readonly max$$ = computed(() => Math.max(this.settings$$().min, this.settings$$().max));
  protected readonly isRange$$ = computed(() => this.settings$$().isRange);

  protected readonly heightString$$ = computed(() => `var(--unit-${this.settings$$().height})`);
  protected readonly borderRadiusString$$ = computed(() => `var(--unit-${this.settings$$().borderRadius})`);

  protected readonly thumbBorderRadiusString$$ = computed(() => {
    const radius = this.settings$$().thumbBorderRadius;
    if (radius === 'full') return '50%';
    return `var(--unit-${radius})`;
  });

  protected readonly fillRadiusString$$ = computed(() => {
    if (!this.isRange$$()) return '0px';
    return `var(--unit-${this.settings$$().borderRadius})`;
  });

  protected readonly trackColor$$ = computed(() => this.settings$$().trackColor);
  protected readonly fillColor$$ = computed(() => this.settings$$().fillColor);
  protected readonly thumbSizeString$$ = computed(() => `var(--unit-${this.settings$$().thumbSize})`);
  protected readonly barStyle$$ = computed(() => {
    const style = this.settings$$().barStyle;
    switch (style) {
      case ProgressBarStyle.Flat:
        return 'flat';
      case ProgressBarStyle.Raised:
        return 'raised';
      case ProgressBarStyle.Inset:
        return 'inset';
      default:
        return 'flat';
    }
  });

  protected readonly displayValue$$ = computed(() => this.clampToBounds(this.value(), this.min$$(), this.max$$()));

  protected readonly displayRange$$ = computed(() => {
    const [start, end] = this.range();
    const min = this.min$$();
    const max = this.max$$();
    const clampedStart = this.clampToBounds(start, min, max);
    const clampedEnd = this.clampToBounds(end, min, max);
    const lower = Math.min(clampedStart, clampedEnd);
    const upper = Math.max(clampedStart, clampedEnd);

    return [lower, upper] as VSliderRangeValue;
  });

  protected readonly thumbStartPosition$$ = computed(() => {
    const value = this.isRange$$() ? this.displayRange$$()[0] : this.displayValue$$();

    return this.isRange$$() ? this.valueToPercentForRangeStart(value) : this.valueToPercentSingle(value);
  });

  protected readonly thumbEndPosition$$ = computed(() => {
    const value = this.isRange$$() ? this.displayRange$$()[1] : this.displayValue$$();

    return this.isRange$$() ? this.valueToPercentForRangeEnd(value) : this.valueToPercentSingle(value);
  });

  protected readonly fillStart$$ = computed(() => {
    if (!this.isRange$$()) return '0%';

    return this.valueToPercentForRangeEdge(this.displayRange$$()[0]);
  });

  protected readonly fillEnd$$ = computed(() => {
    if (this.isRange$$()) return this.valueToPercentForRangeEdge(this.displayRange$$()[1]);

    return this.valueToPercentSingle(this.displayValue$$());
  });

  private readonly activeThumb$$ = signal<ActiveThumb>('end');
  private readonly isDragging$$ = signal(false);
  private readonly pointerId$$ = signal<number | null>(null);

  private readonly normalizeEffect = effect(() => {
    const min = this.min$$();
    const max = this.max$$();

    if (this.isRange$$()) {
      const current = this.range();
      const clampedStart = this.clampToBounds(current[0], min, max);
      const clampedEnd = this.clampToBounds(current[1], min, max);
      const nextStart = Math.min(clampedStart, clampedEnd);
      const nextEnd = Math.max(clampedStart, clampedEnd);

      if (current[0] !== nextStart || current[1] !== nextEnd) {
        this.range.set([nextStart, nextEnd]);
      }

      return;
    }

    const currentValue = this.value();
    const clampedValue = this.clampToBounds(currentValue, min, max);

    if (currentValue !== clampedValue) {
      this.value.set(clampedValue);
    }
  });

  protected onTrackPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;

    event.preventDefault();
    if (this.isRange$$()) {
      const value = this.positionToValueForRangeEdge(event);
      const thumb = this.getClosestThumb(value);
      this.startDrag(event, thumb, this.positionToValue(event, thumb));
      return;
    }

    const value = this.positionToValue(event, 'end');
    this.startDrag(event, 'end', value);
  }

  protected onThumbPointerDown(event: PointerEvent, thumb: ActiveThumb): void {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    this.startDrag(event, thumb);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.isDragging$$()) return;

    if (this.pointerId$$() !== event.pointerId) return;

    const value = this.positionToValue(event, this.activeThumb$$());
    this.applyValue(value, this.activeThumb$$());
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.isDragging$$()) return;

    if (this.pointerId$$() !== event.pointerId) return;

    this.isDragging$$.set(false);
    this.pointerId$$.set(null);
    const root = this.rootElement().nativeElement;

    if (root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }
  }

  private startDrag(event: PointerEvent, thumb: ActiveThumb, initialValue?: number): void {
    this.activeThumb$$.set(thumb);
    this.isDragging$$.set(true);
    this.pointerId$$.set(event.pointerId);
    this.rootElement().nativeElement.setPointerCapture(event.pointerId);
    const value = initialValue ?? this.positionToValue(event, thumb);
    this.applyValue(value, thumb);
  }

  private applyValue(value: number, activeThumb: ActiveThumb): void {
    const min = this.min$$();
    const max = this.max$$();
    const clamped = this.clampToBounds(value, min, max);

    if (!this.isRange$$()) {
      this.value.set(clamped);
      return;
    }

    this.applyRangeValue(clamped, activeThumb);
  }

  private applyRangeValue(value: number, activeThumb: ActiveThumb): void {
    const [start, end] = this.range();
    if (activeThumb === 'start') {
      this.range.set([Math.min(value, end), end]);
      return;
    }
    this.range.set([start, Math.max(value, start)]);
  }

  private getClosestThumb(value: number): ActiveThumb {
    const [start, end] = this.displayRange$$();
    const distStart = Math.abs(value - start);
    const distEnd = Math.abs(value - end);

    return distStart <= distEnd ? 'start' : 'end';
  }

  private positionToValue(event: PointerEvent, activeThumb: ActiveThumb): number {
    const rect = this.trackElement().nativeElement.getBoundingClientRect();

    if (rect.width <= 0) return this.min$$();

    const trackWidth = rect.width;
    const thumbSize = this.unitToPx(this.settings$$().thumbSize);
    const halfThumb = thumbSize / 2;
    const min = this.min$$();
    const max = this.max$$();
    const range = max - min;

    const centerMin = halfThumb;
    const centerMax = trackWidth - halfThumb;
    const centerX = Math.min(centerMax, Math.max(centerMin, event.clientX - rect.left));

    if (!this.isRange$$()) {
      const effectiveWidth = Math.max(0, trackWidth - thumbSize);
      const ratio = effectiveWidth === 0 ? 0 : (centerX - halfThumb) / effectiveWidth;
      return min + ratio * range;
    }

    const edgeMin = thumbSize;
    const edgeMax = trackWidth - thumbSize;
    const edgeWidth = Math.max(0, edgeMax - edgeMin);
    const edgePos = activeThumb === 'start' ? centerX + halfThumb : centerX - halfThumb;
    const clampedEdge = Math.min(edgeMax, Math.max(edgeMin, edgePos));
    const ratio = edgeWidth === 0 ? 0 : (clampedEdge - edgeMin) / edgeWidth;
    return min + ratio * range;
  }

  private positionToValueForRangeEdge(event: PointerEvent): number {
    const rect = this.trackElement().nativeElement.getBoundingClientRect();
    if (rect.width <= 0) return this.min$$();

    const trackWidth = rect.width;
    const thumbSize = this.unitToPx(this.settings$$().thumbSize);
    const edgeMin = thumbSize;
    const edgeMax = trackWidth - thumbSize;
    const edgeWidth = Math.max(0, edgeMax - edgeMin);
    const edgePos = Math.min(edgeMax, Math.max(edgeMin, event.clientX - rect.left));

    const min = this.min$$();
    const max = this.max$$();
    const range = max - min;
    const ratio = edgeWidth === 0 ? 0 : (edgePos - edgeMin) / edgeWidth;
    return min + ratio * range;
  }

  private valueToPercentSingle(value: number): string {
    const min = this.min$$();
    const max = this.max$$();
    const range = max - min;
    if (range === 0) return '0%';

    const rect = this.trackElement().nativeElement.getBoundingClientRect();
    const width = rect.width;
    if (width <= 0) return '0%';

    const thumbSize = this.unitToPx(this.settings$$().thumbSize);
    const halfThumb = thumbSize / 2;
    const effectiveWidth = Math.max(0, width - thumbSize);
    const ratio = (value - min) / range;
    const position = halfThumb + ratio * effectiveWidth;
    const percent = (position / width) * 100;
    return `${percent}%`;
  }

  private valueToPercentForRangeStart(value: number): string {
    return this.valueToPercentWithEdge(value, -1);
  }

  private valueToPercentForRangeEnd(value: number): string {
    return this.valueToPercentWithEdge(value, 1);
  }

  private valueToPercentForRangeEdge(value: number): string {
    return this.valueToPercentWithEdge(value, 0);
  }

  private valueToPercentWithEdge(value: number, edgeDirection: -1 | 0 | 1): string {
    const min = this.min$$();
    const max = this.max$$();
    const range = max - min;
    if (range === 0) return '0%';

    const rect = this.trackElement().nativeElement.getBoundingClientRect();
    const width = rect.width;
    if (width <= 0) return '0%';

    const thumbSize = this.unitToPx(this.settings$$().thumbSize);
    const halfThumb = thumbSize / 2;
    const edgeMin = thumbSize;
    const edgeMax = width - thumbSize;
    const edgeWidth = Math.max(0, edgeMax - edgeMin);
    const ratio = (value - min) / range;
    const edgePos = edgeMin + ratio * edgeWidth;
    const position = edgePos + edgeDirection * halfThumb;
    const percent = (position / width) * 100;
    return `${percent}%`;
  }

  private unitToPx(value: CssUnitValue): number {
    return value * 4;
  }

  private clampToBounds(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
