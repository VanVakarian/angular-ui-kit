import { Component, contentChildren, effect, input, signal } from '@angular/core';
import { VExpand } from './v-expand';

export interface AccordionItemPosition {
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isOpen: () => boolean;
  toggle: () => void;
}

@Component({
  selector: 'v-accordion',
  template: '<ng-content />',
  standalone: true,
  host: {
    class: 'v-accordion-group',
    style: 'display: block;',
  },
})
export class VAccordion {
  public readonly multiple = input<boolean>(false);

  public readonly items = contentChildren(VExpand, { descendants: false });

  private readonly openedIndices$$ = signal<Set<number>>(new Set());

  private readonly itemsChangeEffect$$ = effect(
    () => {
      const items = this.items();
      if (items.length > 0) {
        this.updatePositions();
      }
    },
    { allowSignalWrites: true },
  );

  private updatePositions(): void {
    const itemsArray = this.items();
    const totalItems = itemsArray.length;

    itemsArray.forEach((item, index) => {
      const position: AccordionItemPosition = {
        index,
        isFirst: index === 0,
        isLast: index === totalItems - 1,
        isOpen: () => this.openedIndices$$().has(index),
        toggle: () => this.toggle(index),
      };

      item.registerInAccordion(position);
    });
  }

  private toggle(index: number): void {
    const opened = new Set(this.openedIndices$$());

    if (this.multiple()) {
      if (opened.has(index)) {
        opened.delete(index);
      } else {
        opened.add(index);
      }
    } else {
      if (opened.has(index)) {
        opened.clear();
      } else {
        opened.clear();
        opened.add(index);
      }
    }

    this.openedIndices$$.set(opened);
  }
}
