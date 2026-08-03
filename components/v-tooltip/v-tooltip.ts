import {
  Component,
  computed,
  ElementRef,
  Inject,
  inject,
  input,
  OnDestroy,
  Optional,
  signal,
  viewChild,
} from '@angular/core';
import { LayerController, PARENT_LAYER_ID, ZLayerService } from '@ui-kit/services/z-layer.service';
import { computeTooltipPosition } from './tooltip-position';

@Component({
  selector: 'v-tooltip',
  templateUrl: './v-tooltip.html',
  styleUrl: './v-tooltip.css',
  host: {
    '[style.--v-tooltip-z-index]': 'zIndex$$()',
    '[class.fill]': 'fill()',
    '[class.no-wrap]': 'noWrap()',
  },
})
export class VTooltip implements OnDestroy {
  public readonly text = input.required<string>();
  // When true, the trigger stretches to fill its positioned parent instead
  // of sizing to its content — for wrapping an already-sized container
  // (e.g. a timeline segment too small to show its own label).
  public readonly fill = input(false);
  // When true, the panel text is forced to a single line regardless of
  // maxWidth instead of wrapping.
  public readonly noWrap = input(false);
  public readonly maxWidth = input<string>('280px');

  protected readonly triggerElem = viewChild.required<ElementRef<HTMLElement>>('triggerElem');
  protected readonly panelElem = viewChild<ElementRef<HTMLElement>>('panelElem');

  protected readonly isOpen$$ = signal(false);
  protected readonly isPositioned$$ = signal(false);
  protected readonly placement$$ = signal<'top' | 'bottom'>('top');
  protected readonly fixedTop$$ = signal(0);
  protected readonly fixedLeft$$ = signal(0);
  protected readonly zIndex$$ = computed(() => this.layerController.zIndex);

  private readonly zLayerService = inject(ZLayerService);
  private readonly layerController: LayerController;

  constructor(
    @Optional()
    @Inject(PARENT_LAYER_ID)
    parentLayerId?: string,
  ) {
    this.layerController = this.zLayerService.registerLayer('tooltip', parentLayerId);
  }

  public ngOnDestroy(): void {
    this.layerController.destroy();
  }

  protected open(): void {
    this.isOpen$$.set(true);
    this.isPositioned$$.set(false);
    setTimeout(() => this.updatePosition(), 0);
  }

  protected close(): void {
    this.isOpen$$.set(false);
    this.isPositioned$$.set(false);
  }

  private updatePosition(): void {
    const panel = this.panelElem()?.nativeElement;
    if (!panel) return;

    const triggerRect = this.triggerElem().nativeElement.getBoundingClientRect();
    const position = computeTooltipPosition(triggerRect, panel.getBoundingClientRect());

    this.placement$$.set(position.placement);
    this.fixedTop$$.set(position.top);
    this.fixedLeft$$.set(position.left);
    this.isPositioned$$.set(true);
  }
}
