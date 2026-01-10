import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  input,
  model,
  Optional,
  output,
  Self,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { getValidationErrorMessage } from '@app/shared/ui-kit/components/v-input/validators';
import { CssUnitValue } from '@app/shared/ui-kit/types';

type InputValue = string | number | null;

type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url';

type InputMode = 'none' | 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url' | 'search';

type FontSize = `${number}px` | `${number}rem` | `${number}em` | `${number}%`;

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

type TextAlign = 'left' | 'right' | 'center';

export interface VInputConfig {
  isDisabled?: boolean;
  isReadonly?: boolean;
  type?: InputType;
  inputmode?: InputMode;
  pattern?: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  name?: string;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  textAlign?: TextAlign;
  borderRadius?: CssUnitValue;
  isTextarea?: boolean;
  rows?: number;
  cols?: number;
}

const DEFAULT_V_INPUT_CONFIG: Required<VInputConfig> = {
  isDisabled: false,
  isReadonly: false,
  type: 'text',
  inputmode: 'text',
  pattern: '',
  label: '',
  placeholder: '',
  errorMessage: '',
  name: '',
  fontSize: '1rem',
  fontWeight: 400,
  textAlign: 'left',
  borderRadius: 2,
  isTextarea: false,
  rows: 3,
  cols: 50,
};

let uniqueId = 0;

@Component({
  selector: 'v-input',
  templateUrl: './v-input.html',
  styleUrl: './v-input.css',
  host: {
    '[style.--v-input-border-radius]': 'borderRadiusString$$()',
    '[class]': '"v-input"',
  },
  imports: [CommonModule],
})
export class VInput implements ControlValueAccessor {
  public readonly inputElement = viewChild.required<ElementRef<HTMLInputElement | HTMLTextAreaElement>>('inputElement');

  public readonly config = input<VInputConfig>({});

  public readonly value = model<string>('');

  public readonly onInputChanged = output<Event>();
  public readonly onFocused = output<Event>();
  public readonly onBlurred = output<Event>();
  public readonly onEnterPressed = output<Event>();

  protected readonly settings$$ = computed(() => ({
    ...DEFAULT_V_INPUT_CONFIG,
    ...this.config(),
  }));

  protected readonly borderRadiusString$$ = computed(() => `var(--unit-${this.settings$$().borderRadius})`);

  protected ngControlValue$$: WritableSignal<string> = signal('');
  protected isFocused = false;
  protected hasInteracted = false;
  protected readonly inputId = `v-input-${++uniqueId}`;

  protected readonly displayValue$$ = computed(() => {
    return this.ngControl ? this.ngControlValue$$() : this.value();
  });

  constructor(
    @Optional()
    @Self()
    public ngControl: NgControl | null,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  protected getErrorMessage(): string {
    if (!this.hasInteracted) return '';
    return this.settings$$().errorMessage || this.getValidationErrorMessage();
  }

  private getValidationErrorMessage(): string {
    if (!this.ngControl) return '';

    const control = this.ngControl.control;
    if (!control || !control.errors) return '';

    const errorKey = Object.keys(control.errors)[0];
    const errorValue = control.errors[errorKey];

    return getValidationErrorMessage(errorKey, errorValue);
  }

  private onChange = (value: InputValue) => {};

  private onTouched = () => {};

  public writeValue(value: InputValue): void {
    this.ngControlValue$$.set(value != null ? String(value) : '');
    this.hasInteracted = false;
  }

  public registerOnChange(fn: (value: InputValue) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {}

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const newValue = target.value;
    this.hasInteracted = true;

    if (this.ngControl) {
      this.ngControlValue$$.set(newValue);
      this.onChange(newValue);
    } else {
      this.value.set(newValue);
    }

    this.onInputChanged.emit(event);
  }

  protected onFocus(): void {
    this.isFocused = true;
    const event = new Event('focus');
    this.onFocused.emit(event);
  }

  protected onBlur(): void {
    this.isFocused = false;
    if (this.ngControl) {
      this.onTouched();
    }
    const event = new Event('blur');
    this.onBlurred.emit(event);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.settings$$().isTextarea) {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const didApply = this.applyArrowStep(event);
        if (didApply) return;
      }

      if (event.key === 'Enter') {
        this.onEnterPressed.emit(event);
      }
    }
  }

  private applyArrowStep(event: KeyboardEvent): boolean {
    const settings = this.settings$$();
    if (settings.isTextarea) return false;
    if (settings.isDisabled || settings.isReadonly) return false;

    const isNumericLike =
      settings.type === 'number' || settings.inputmode === 'numeric' || settings.inputmode === 'decimal';
    if (!isNumericLike) return false;

    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const rawValue = target.value;
    const parsed = this.parseNumericInput(rawValue);
    if (!parsed) return false;

    event.preventDefault();

    const delta = event.key === 'ArrowUp' ? 1 : -1;
    const nextNum = parsed.value + delta;
    const nextRaw = parsed.usesComma ? String(nextNum).replace('.', ',') : String(nextNum);
    this.applyKeyboardValue(nextRaw);
    this.onInputChanged.emit(event);

    return true;
  }

  private parseNumericInput(rawValue: string): { value: number; usesComma: boolean } | null {
    const trimmed = rawValue.trim();
    if (trimmed === '') return { value: 0, usesComma: false };

    const usesComma = trimmed.includes(',') && !trimmed.includes('.');
    const normalized = usesComma ? trimmed.replace(',', '.') : trimmed;

    if (!/^[+-]?(?:\d+|\d*\.\d+)(?:\.)?$/.test(normalized) && !/^[+-]?\d+(?:\.)?$/.test(normalized)) {
      return null;
    }

    const num = Number(normalized.endsWith('.') ? normalized.slice(0, -1) : normalized);
    if (!Number.isFinite(num)) return null;

    return { value: num, usesComma };
  }

  private applyKeyboardValue(newValue: string): void {
    this.hasInteracted = true;

    if (this.ngControl) {
      this.ngControlValue$$.set(newValue);
      this.onChange(newValue);
    } else {
      this.value.set(newValue);
    }
  }

  public focus(): void {
    this.inputElement().nativeElement.focus();
  }

  public blur(): void {
    this.inputElement().nativeElement.blur();
  }
}
