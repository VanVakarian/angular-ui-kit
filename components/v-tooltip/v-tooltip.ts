import {
  Component,
  computed,
  ElementRef,
  HostListener,
  Inject,
  inject,
  input,
  OnDestroy,
  Optional,
  signal,
  viewChild,
} from '@angular/core';
import { LayerController, PARENT_LAYER_ID, ZLayerService } from '@ui-kit/services/z-layer.service';

const VIEWPORT_MARGIN_PX = 8;
const TRIGGER_GAP_PX = 8;

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
  public readonly maxWidth = input<string>('280px');
  // When true, the trigger stretches to fill its positioned parent instead
  // of sizing to its content — for wrapping an already-sized container
  // (e.g. a timeline segment too small to show its own label).
  public readonly fill = input(false);
  // When true, the panel text is forced to a single line regardless of
  // maxWidth instead of wrapping.
  public readonly noWrap = input(false);

  protected readonly triggerElem = viewChild.required<ElementRef<HTMLElement>>('triggerElem');
  protected readonly panelElem = viewChild<ElementRef<HTMLElement>>('panelElem');

  protected readonly isOpen$$ = signal(false);
  protected readonly isPositioned$$ = signal(false);
  protected readonly placement$$ = signal<'top' | 'bottom'>('top');
  protected readonly fixedTop$$ = signal(0);
  protected readonly fixedLeft$$ = signal(0);
  protected readonly zIndex$$ = computed(() => this.layerController.zIndex);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
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

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen$$()) return;
    if (this.elementRef.nativeElement.contains(event.target as Node)) return;
    this.close();
  }

  protected onTriggerClick(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen$$() ? this.close() : this.open();
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
    const panelRect = panel.getBoundingClientRect();

    const fitsAbove = triggerRect.top - panelRect.height - TRIGGER_GAP_PX >= VIEWPORT_MARGIN_PX;
    this.placement$$.set(fitsAbove ? 'top' : 'bottom');

    const top = fitsAbove
      ? triggerRect.top - panelRect.height - TRIGGER_GAP_PX
      : triggerRect.bottom + TRIGGER_GAP_PX;

    const idealLeft = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2;
    const maxLeft = window.innerWidth - panelRect.width - VIEWPORT_MARGIN_PX;
    const left = Math.min(Math.max(idealLeft, VIEWPORT_MARGIN_PX), Math.max(maxLeft, VIEWPORT_MARGIN_PX));

    this.fixedTop$$.set(top);
    this.fixedLeft$$.set(left);
    this.isPositioned$$.set(true);
  }
}
