import { Directive, effect, EffectRef, ElementRef, Host, HostListener, input, OnDestroy, OnInit } from '@angular/core';
import { AccordionService } from './accordion.service';
import { VExpand } from './v-expand';

@Directive({
  selector: '[accordion]',
  host: {
    '[class.open]': 'isOpen()',
  },
})
export class AccordionDirective implements OnInit, OnDestroy {
  public readonly accordion = input.required<string>();
  public readonly accordionId = input.required<string>();

  private groupId = '';

  private readonly syncEffectRef$$: EffectRef = effect(() => {
    const groupId = this.accordion();
    this.groupId = groupId;

    const opened = this.accordionService.openedIds$$();
    const isOpen = opened.get(groupId) === this.accordionId();
    this.vExpand.setExpanded(isOpen);
  });

  constructor(
    private accordionService: AccordionService,
    private el: ElementRef,
    @Host()
    private vExpand: VExpand,
  ) {}

  public ngOnInit() {
    this.groupId = this.accordion();
  }

  public ngOnDestroy() {
    this.syncEffectRef$$.destroy();
  }

  protected isOpen(): boolean {
    const opened = this.accordionService.openedIds$$();
    return opened.get(this.groupId) === this.accordionId();
  }

  @HostListener('click', ['$event'])
  protected toggle(event: Event) {
    const target = event.target as HTMLElement;
    const headerElement = this.el.nativeElement.querySelector('.header');

    if (headerElement && headerElement.contains(target)) {
      this.accordionService.toggle(this.groupId, this.accordionId());
    }
  }
}
