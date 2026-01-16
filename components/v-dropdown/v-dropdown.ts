import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  Inject,
  input,
  OnDestroy,
  OnInit,
  Optional,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { VInput, VInputConfig } from '@ui-kit/components/v-input/v-input';
import { VBackdropDirective } from '@ui-kit/directives/backdrop.directive';
import { LayerController, PARENT_LAYER_ID, ZLayerService } from '@ui-kit/services/z-layer.service';

export enum ddExpandDirection {
  Left = 'left',
  Right = 'right',
}

export interface DropdownItem {
  value: string;
  label: string;
}

@Component({
  selector: 'v-dropdown',
  templateUrl: './v-dropdown.html',
  styleUrl: './v-dropdown.css',
  host: {
    '[style.--v-dropdown-z-index]': 'zIndex$$()',
    '[style.--v-dropdown-backdrop-z-index]': 'backdropZIndex$$()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VDropdown),
      multi: true,
    },
  ],
  imports: [CommonModule, VInput, ReactiveFormsModule, VBackdropDirective],
})
export class VDropdown implements ControlValueAccessor, OnInit, OnDestroy {
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly isDisabled = input<boolean>(false);
  public readonly isRequired = input<boolean>(false);
  public readonly errorMessage = input<string>('');
  public readonly items = input<DropdownItem[]>([]);
  public readonly minDropdownWidth = input<string>('');
  public readonly expandDirection = input<ddExpandDirection>(ddExpandDirection.Left);

  public readonly onSelectionChanged = output<DropdownItem | null>();

  protected readonly inputComponent = viewChild.required<VInput>('inputComponent');

  protected readonly inputConfig$$ = computed<VInputConfig>(() => ({
    label: this.label(),
    placeholder: this.placeholder(),
    isDisabled: this.isDisabled(),
    errorMessage: this.computedErrorMessage$$(),
  }));

  protected readonly value$$ = signal('');
  protected readonly isOpen$$ = signal(false);
  protected readonly filteredItems$$ = signal<DropdownItem[]>([]);
  protected readonly validationError$$ = signal('');
  protected readonly dropdownWidth$$ = signal(0);
  protected readonly zIndex$$ = signal(100);
  protected readonly backdropZIndex$$ = signal(90);
  protected readonly internalForm = new FormGroup({
    search: new FormControl(''),
  });

  private onChange = (value: string) => {};
  private onTouched = () => {};
  private layerController?: LayerController;

  constructor(
    private readonly elementRef: ElementRef,
    private readonly zLayerService: ZLayerService,
    @Optional()
    @Inject(PARENT_LAYER_ID)
    private readonly parentLayerId?: string,
  ) {
    this.internalForm.get('search')?.valueChanges.subscribe((value) => {
      this.value$$.set(value || '');
      this.onChange(this.value$$());
      this.updateFilteredItems();
      this.isOpen$$.set(true);
    });
  }

  public ngOnInit(): void {
    this.registerLayer();
  }

  public ngOnDestroy(): void {
    this.layerController?.destroy();
  }

  protected readonly computedErrorMessage$$ = computed(() => {
    if (this.isOpen$$()) {
      return this.errorMessage();
    }
    return this.validationError$$() || this.errorMessage();
  });

  protected readonly dropdownListStyles$$ = computed(() => {
    const styles: { [key: string]: string } = {};
    const dropdownWidth = this.dropdownWidth$$();

    if (dropdownWidth > 0) {
      styles['width'] = `${dropdownWidth}px`;
    } else if (this.minDropdownWidth()) {
      styles['min-width'] = this.minDropdownWidth();
    }

    return styles;
  });

  public writeValue(value: string | null): void {
    this.value$$.set(value || '');
    this.internalForm.get('search')?.setValue(this.value$$(), { emitEvent: false });
    this.updateFilteredItems();
    this.validateInput();
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {}

  protected onFocus(): void {
    this.isOpen$$.set(true);
    this.updateFilteredItems();
    this.setDropdownWidth();
  }

  protected onBlur(): void {
    setTimeout(() => {
      this.closeDropdown();
    }, 150);
  }

  protected selectItem(item: DropdownItem): void {
    this.value$$.set(item.label);
    this.validationError$$.set('');
    this.internalForm.get('search')?.setValue(this.value$$(), { emitEvent: false });
    this.onChange(item.value);
    this.onSelectionChanged.emit(item);
    this.isOpen$$.set(false);
    const inputComp = this.inputComponent();
    if (inputComp) {
      const element = inputComp.inputElement();
      if (element) {
        element.nativeElement.blur();
      }
    }
  }

  protected clearInput(): void {
    this.value$$.set('');
    this.validationError$$.set('');
    this.internalForm.get('search')?.setValue('', { emitEvent: false });
    this.onChange('');
    this.onSelectionChanged.emit(null);
    this.updateFilteredItems();
  }

  protected closeDropdown(): void {
    this.isOpen$$.set(false);
    this.validateInput();
    this.onTouched();
  }

  private updateFilteredItems(): void {
    if (!this.value$$().trim()) {
      this.filteredItems$$.set(this.items());
    } else {
      this.filteredItems$$.set(
        this.items().filter((item) => item.label.toLowerCase().includes(this.value$$().toLowerCase())),
      );
    }
  }

  private validateInput(): void {
    if (!this.isRequired() || !this.value$$().trim()) {
      this.validationError$$.set('');
      return;
    }

    const exactMatch = this.items().find((item) => item.label.toLowerCase() === this.value$$().toLowerCase());

    if (!exactMatch) {
      this.validationError$$.set('Please select a valid option from the list');
    } else {
      this.validationError$$.set('');
    }
  }

  private setDropdownWidth(): void {
    if (!this.elementRef?.nativeElement) {
      return;
    }

    setTimeout(() => {
      const hostElement = this.elementRef.nativeElement;
      const hostRect = hostElement.getBoundingClientRect();
      const minWidthValue = this.minDropdownWidth() ? parseInt(this.minDropdownWidth().replace(/[^\d]/g, '')) || 0 : 0;
      this.dropdownWidth$$.set(Math.max(hostRect.width, minWidthValue));
    }, 0);
  }

  private registerLayer(): void {
    this.layerController = this.zLayerService.registerLayer('dropdown', this.parentLayerId);
    this.zIndex$$.set(this.layerController.zIndex);
    this.backdropZIndex$$.set(this.layerController.getBackdropZIndex());
  }
}
