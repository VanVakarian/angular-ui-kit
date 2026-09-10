import { afterNextRender, Component, DestroyRef, effect, ElementRef, inject, input, viewChild } from '@angular/core';
import { RollingNumberEngine, RollingNumberFeel, RollingNumberMode } from './rolling-number-engine';

// Renders `textInput` as normal accessible text, then animates every subsequent change to
// it glyph-by-glyph (digits roll like a slot-machine reel, everything else cross-fades) —
// see RollingNumberEngine for the actual mechanism, and 34-rolling-number-ui-kit-component
// in plans/ for the design behind it. Pass an already-formatted string; this component has
// no opinion on number formatting.
//
// Encapsulation stays at the default (Emulated) so :host actually works — Angular only
// adds the `_nghost-*` attribute that makes :host rules match when encapsulation is
// Emulated. The engine builds per-glyph cells with raw document.createElement, bypassing
// the template compiler, so it separately copies the matching `_ngcontent-*` attribute
// onto them (see RollingNumberEngine) so the scoped .rn-cell/.rn-strip/.rn-glyph rules
// below still reach that imperatively-created DOM.
@Component({
  selector: 'v-rolling-number',
  templateUrl: './v-rolling-number.html',
  styleUrl: './v-rolling-number.css',
})
export class VRollingNumber {
  public readonly textInput = input.required<string>();
  public readonly modeInput = input<RollingNumberMode>('rolling');
  public readonly feelInput = input<RollingNumberFeel>('snappy');

  private readonly staticTextElem = viewChild.required<ElementRef<HTMLElement>>('staticText');
  private readonly overlayElem = viewChild.required<ElementRef<HTMLElement>>('overlay');

  private readonly hostElem = inject(ElementRef<HTMLElement>);

  private engine: RollingNumberEngine | null = null;

  public constructor() {
    afterNextRender(() => {
      this.engine = new RollingNumberEngine(
        this.hostElem.nativeElement,
        this.overlayElem().nativeElement,
        this.staticTextElem().nativeElement,
        {
          mode: this.modeInput(),
          feel: this.feelInput(),
        },
      );
      this.engine.commit(this.textInput(), true);
    });

    effect(() => {
      const text = this.textInput();
      this.engine?.commit(text);
    });

    inject(DestroyRef).onDestroy(() => this.engine?.destroy());
  }
}
