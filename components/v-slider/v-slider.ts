import { Component, computed, effect, ElementRef, input, model, signal, viewChild } from '@angular/core';
import { ProgressBarStyle } from '@ui-kit/components/types';
import { CssUnitValue } from '@ui-kit/types';

export type VSliderRangeValue = [number, number];

type ActiveThumb = 'start' | 'end';

type DragMode = 'single' | 'range-start' | 'range-end' | 'range-shift';

type DragState = {
  mode: DragMode;
  startX: number;
  startValue: number;
  startRange: VSliderRangeValue;
};

export interface VSliderConfig {
  valueList?: number[];
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
  isTouchMode?: boolean;
  touchAreaSize?: CssUnitValue;
}

const DEFAULT_V_SLIDER_CONFIG: Required<VSliderConfig> = {
  valueList: [],
  min: 0,
  max: 100,
  height: 3,
  borderRadius: 2,
  thumbBorderRadius: 'full',
  trackColor: 'var(--v-color-surface)',
  fillColor: 'var(--v-color-primary)',
  barStyle: ProgressBarStyle.Flat,
  thumbSize: 6,
  isRange: false,
  isTouchMode: false,
  touchAreaSize: 12,
};

@Component({
  selector: 'v-slider',
  templateUrl: './v-slider.html',
  styleUrl: './v-slider.css',
  host: {
    '[class.touch-mode]': 'isTouchMode$$()',
    '[class.dragging]': 'isDragging$$()',
    '[style.--v-slider-height]': 'heightString$$()',
    '[style.--v-slider-border-radius]': 'borderRadiusString$$()',
    '[style.--v-slider-track-color]': 'trackColor$$()',
    '[style.--v-slider-fill-color]': 'fillColor$$()',
    '[style.--v-slider-thumb-size]': 'thumbSizeString$$()',
    '[style.--v-slider-thumb-border-radius]': 'thumbBorderRadiusString$$()',
    '[style.--v-slider-touch-size]': 'touchAreaSizeString$$()',
    '[style.--v-slider-track-margin]': 'trackMarginString$$()',
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

  protected readonly isTouchMode$$ = computed(() => this.settings$$().isTouchMode);
  protected readonly touchAreaSizeString$$ = computed(() => `var(--unit-${this.settings$$().touchAreaSize})`);

  protected readonly valueList$$ = computed(() => {
    const list = this.settings$$().valueList;
    if (!Array.isArray(list)) return [];
    const filtered = list.filter((value) => Number.isFinite(value));
    if (filtered.length <= 1) return [];
    return [...filtered].sort((a, b) => a - b);
  });

  protected readonly min$$ = computed(() => {
    const list = this.valueList$$();
    if (list.length > 0) return list[0];
    return Math.min(this.settings$$().min, this.settings$$().max);
  });

  protected readonly max$$ = computed(() => {
    const list = this.valueList$$();
    if (list.length > 0) return list[list.length - 1];
    return Math.max(this.settings$$().min, this.settings$$().max);
  });

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

  protected readonly trackMarginString$$ = computed(() => {
    const trackHeightPx = this.unitToPx(this.settings$$().height);
    const thumbSizePx = this.unitToPx(this.settings$$().thumbSize);
    const thumbOuterPx = thumbSizePx + 4;
    const marginPx = Math.max(0, (thumbOuterPx - trackHeightPx) / 2);
    return `${marginPx}px`;
  });

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

  protected readonly displayValue$$ = computed(() => this.normalizeValue(this.value()));

  protected readonly displayRange$$ = computed(() => {
    const [start, end] = this.range();
    const clampedStart = this.normalizeValue(start);
    const clampedEnd = this.normalizeValue(end);
    const lower = Math.min(clampedStart, clampedEnd);
    const upper = Math.max(clampedStart, clampedEnd);

    return [lower, upper] as VSliderRangeValue;
  });

  protected readonly thumbStartPosition$$ = computed(() => {
    const isRange = this.isRange$$();
    const value = isRange ? this.displayRange$$()[0] : this.displayValue$$();
    return isRange ? this.valueToPercentForRangeStart(value) : this.valueToPercentSingle(value);
  });

  protected readonly thumbEndPosition$$ = computed(() => {
    const isRange = this.isRange$$();
    const value = isRange ? this.displayRange$$()[1] : this.displayValue$$();
    return isRange ? this.valueToPercentForRangeEnd(value) : this.valueToPercentSingle(value);
  });

  protected readonly fillStart$$ = computed(() => {
    if (!this.isRange$$()) return '0%';
    return this.valueToPercentForRangeEdge(this.displayRange$$()[0]);
  });

  protected readonly fillEnd$$ = computed(() => {
    if (this.isRange$$()) return this.valueToPercentForRangeEdge(this.displayRange$$()[1]);
    return this.valueToPercentSingle(this.displayValue$$());
  });

  protected readonly isDragging$$ = signal(false);
  private readonly pointerId$$ = signal<number | null>(null);
  private readonly dragState$$ = signal<DragState | null>(null);
  protected readonly touchActive$$ = signal(false);
  protected readonly activeTouchThumb$$ = signal<ActiveThumb | null>(null);

  private readonly normalizeEffect = effect(() => {
    if (this.isRange$$()) {
      const current = this.range();
      const clampedStart = this.normalizeValue(current[0]);
      const clampedEnd = this.normalizeValue(current[1]);
      const nextStart = Math.min(clampedStart, clampedEnd);
      const nextEnd = Math.max(clampedStart, clampedEnd);

      if (current[0] !== nextStart || current[1] !== nextEnd) {
        this.range.set([nextStart, nextEnd]);
      }

      return;
    }

    const currentValue = this.value();
    const clampedValue = this.normalizeValue(currentValue);

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
      this.startDrag(event, thumb === 'start' ? 'range-start' : 'range-end');
      return;
    }

    this.startDrag(event, 'single');
  }

  protected onFillPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    if (this.isRange$$()) {
      this.startDrag(event, 'range-shift');
      return;
    }

    this.startDrag(event, 'single');
  }

  protected onThumbPointerDown(event: PointerEvent, thumb: ActiveThumb): void {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    if (this.isTouchMode$$() && event.pointerType === 'touch') {
      this.touchActive$$.set(true);
      this.activeTouchThumb$$.set(thumb);
    }
    if (this.isRange$$()) {
      this.startDrag(event, thumb === 'start' ? 'range-start' : 'range-end');
      return;
    }
    this.startDrag(event, 'single');
  }

  protected onPointerMove(event: PointerEvent): void {
    if (!this.isDragging$$()) return;

    if (this.pointerId$$() !== event.pointerId) return;

    const dragState = this.dragState$$();
    if (!dragState) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaValue = this.deltaToValue(deltaX, dragState.mode);
    const { min, max } = this.getRangeMetrics();

    if (dragState.mode === 'single') {
      const nextValue = this.normalizeValue(dragState.startValue + deltaValue);
      this.value.set(nextValue);
      return;
    }

    const [start, end] = dragState.startRange;

    if (dragState.mode === 'range-start') {
      const nextStart = Math.min(this.normalizeValue(start + deltaValue), end);
      this.range.set([nextStart, end]);
      return;
    }

    if (dragState.mode === 'range-end') {
      const nextEnd = Math.max(this.normalizeValue(end + deltaValue), start);
      this.range.set([start, nextEnd]);
      return;
    }

    const length = end - start;
    let nextStart = start + deltaValue;
    let nextEnd = end + deltaValue;

    if (nextStart < min) {
      nextStart = min;
      nextEnd = min + length;
    }

    if (nextEnd > max) {
      nextEnd = max;
      nextStart = max - length;
    }

    const snappedStart = this.normalizeValue(nextStart);
    const snappedEnd = this.normalizeValue(nextEnd);
    const lower = Math.min(snappedStart, snappedEnd);
    const upper = Math.max(snappedStart, snappedEnd);
    this.range.set([lower, upper]);
  }

  protected onPointerUp(event: PointerEvent): void {
    if (!this.isDragging$$()) return;

    if (this.pointerId$$() !== event.pointerId) return;

    this.isDragging$$.set(false);
    this.pointerId$$.set(null);
    this.dragState$$.set(null);
    this.touchActive$$.set(false);
    this.activeTouchThumb$$.set(null);
    const root = this.rootElement().nativeElement;

    if (root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }
  }

  private startDrag(event: PointerEvent, mode: DragMode): void {
    this.isDragging$$.set(true);
    this.pointerId$$.set(event.pointerId);
    this.rootElement().nativeElement.setPointerCapture(event.pointerId);
    const startValue = this.displayValue$$();
    const startRange = this.displayRange$$();
    this.dragState$$.set({
      mode,
      startX: event.clientX,
      startValue,
      startRange,
    });
  }

  private getClosestThumb(value: number): ActiveThumb {
    const [start, end] = this.displayRange$$();
    const distStart = Math.abs(value - start);
    const distEnd = Math.abs(value - end);

    return distStart <= distEnd ? 'start' : 'end';
  }

  private positionToValueForRangeEdge(event: PointerEvent): number {
    const rect = this.getTrackRect();
    if (rect.width <= 0) return this.min$$();

    const trackWidth = rect.width;
    const thumbSize = this.getThumbSizePx();
    const edgeMin = thumbSize;
    const edgeMax = trackWidth - thumbSize;
    const edgeWidth = Math.max(0, edgeMax - edgeMin);
    const edgePos = Math.min(edgeMax, Math.max(edgeMin, event.clientX - rect.left));

    const { min, range } = this.getRangeMetrics();
    const ratio = edgeWidth === 0 ? 0 : (edgePos - edgeMin) / edgeWidth;
    return min + ratio * range;
  }

  private valueToPercentSingle(value: number): string {
    const { min, range } = this.getRangeMetrics();
    if (range === 0) return '0%';

    const width = this.getTrackRect().width;
    if (width <= 0) return '0%';

    const thumbSize = this.getThumbSizePx();
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
    const { min, range } = this.getRangeMetrics();
    if (range === 0) return '0%';

    const width = this.getTrackRect().width;
    if (width <= 0) return '0%';

    const thumbSize = this.getThumbSizePx();
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

  private getRangeMetrics(): { min: number; max: number; range: number } {
    const min = this.min$$();
    const max = this.max$$();
    return { min, max, range: max - min };
  }

  private normalizeValue(value: number): number {
    const clamped = this.clampToBounds(value, this.min$$(), this.max$$());
    return this.snapToList(clamped);
  }

  private snapToList(value: number): number {
    const list = this.valueList$$();
    if (list.length === 0) return value;
    if (value <= list[0]) return list[0];
    if (value >= list[list.length - 1]) return list[list.length - 1];

    let low = 0;
    let high = list.length - 1;
    while (high - low > 1) {
      const mid = Math.floor((low + high) / 2);
      const midValue = list[mid];
      if (value === midValue) return midValue;
      if (value < midValue) {
        high = mid;
      } else {
        low = mid;
      }
    }

    const lowValue = list[low];
    const highValue = list[high];
    return Math.abs(value - lowValue) <= Math.abs(highValue - value) ? lowValue : highValue;
  }

  private deltaToValue(deltaX: number, mode: DragMode): number {
    const rect = this.getTrackRect();
    if (rect.width <= 0) return 0;

    const { range } = this.getRangeMetrics();
    if (range === 0) return 0;

    const thumbSize = this.getThumbSizePx();
    const availableWidth =
      mode === 'single' ? Math.max(0, rect.width - thumbSize) : Math.max(0, rect.width - thumbSize * 2);

    if (availableWidth === 0) return 0;

    return (deltaX / availableWidth) * range;
  }

  private getTrackRect(): DOMRect {
    return this.trackElement().nativeElement.getBoundingClientRect();
  }

  private getThumbSizePx(): number {
    return this.unitToPx(this.settings$$().thumbSize);
  }

  private unitToPx(value: CssUnitValue): number {
    return value * 4;
  }

  private clampToBounds(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
