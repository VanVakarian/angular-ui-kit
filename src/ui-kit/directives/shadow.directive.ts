import { Directive, ElementRef, OnInit, Renderer2, inject, input } from '@angular/core';

@Directive({
  selector: '[outer-shadow]',
})
export class OuterShadowDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  public ngOnInit() {
    const element = this.el.nativeElement;

    this.renderer.setStyle(element, 'box-shadow', ` var(--v-shadow-outer-1) `);
  }
}

@Directive({
  selector: '[outer-shadow-rounded]',
})
export class OuterShadowRoundedDirective implements OnInit {
  readonly shadowBorderRadius = input<number>(2);

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  public ngOnInit() {
    const element = this.el.nativeElement;

    this.renderer.setStyle(element, 'box-shadow', ` var(--v-shadow-outer-1) `);
    this.renderer.setStyle(element, 'border-radius', `var(--unit-${this.shadowBorderRadius()})`);
  }
}

@Directive({
  selector: '[inner-shadow]',
})
export class InnerShadowDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  public ngOnInit() {
    const element = this.el.nativeElement;

    this.renderer.setStyle(element, 'box-shadow', ` var(--v-shadow-inset-2) `);
  }
}

@Directive({
  selector: '[inner-shadow-rounded]',
})
export class InnerShadowRoundedDirective implements OnInit {
  readonly shadowBorderRadius = input<number>(2);

  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  public ngOnInit() {
    const element = this.el.nativeElement;

    this.renderer.setStyle(element, 'box-shadow', ` var(--v-shadow-inset-2) `);
    this.renderer.setStyle(element, 'border-radius', `var(--unit-${this.shadowBorderRadius()})`);
  }
}
