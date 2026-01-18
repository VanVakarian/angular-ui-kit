export enum VInputAutoSubmitResult {
  Success,
  Error,
}

export enum VInputAutoSubmitState {
  Idle,
  Countdown,
  Submitting,
  Success,
  Error,
}

const DEFAULT_AUTO_SUBMIT_STATUS_FADE_OUT_DELAY = 3000;

interface VInputAutoSubmitOptions {
  isEnabled: () => boolean;
  isValid: () => boolean;
  getValue: () => string;
  getAutoSubmitDelay: () => number;
  emitSubmit: (value: string) => void;
  onStateChange: (state: VInputAutoSubmitState) => void;
}

export class VInputAutoSubmitManager {
  private readonly isEnabled: () => boolean;
  private readonly isValid: () => boolean;
  private readonly getValue: () => string;
  private readonly getAutoSubmitDelay: () => number;
  private readonly emitSubmit: (value: string) => void;
  private readonly onStateChange: (state: VInputAutoSubmitState) => void;

  private currentState: VInputAutoSubmitState = VInputAutoSubmitState.Idle;
  private lastSubmittedValue: string = '';

  private countdownStartTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private delayTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private resetTimeoutId: ReturnType<typeof setTimeout> | null = null;

  public constructor(options: VInputAutoSubmitOptions) {
    this.isEnabled = options.isEnabled;
    this.isValid = options.isValid;
    this.getValue = options.getValue;
    this.getAutoSubmitDelay = options.getAutoSubmitDelay;
    this.emitSubmit = options.emitSubmit;
    this.onStateChange = options.onStateChange;
  }

  public destroy(): void {
    this.clearCountdownStartTimeout();
    this.clearDelayTimeout();
    this.clearResetTimeout();
  }

  public writeValue(value: string): void {
    if (!this.isEnabled()) return;
    this.lastSubmittedValue = value;
  }

  public handleChange(): void {
    if (!this.isEnabled()) return;
    if (this.currentState === VInputAutoSubmitState.Submitting) return;

    const currentValue = this.getValue();
    const isValid = this.isValid();

    if (isValid && currentValue !== this.lastSubmittedValue) {
      this.setState(VInputAutoSubmitState.Idle);
      this.clearCountdownStartTimeout();
      this.clearDelayTimeout();

      this.countdownStartTimeoutId = setTimeout(() => {
        this.setState(VInputAutoSubmitState.Countdown);
        this.clearDelayTimeout();
        this.delayTimeoutId = setTimeout(() => {
          if (this.currentState === VInputAutoSubmitState.Countdown) {
            this.triggerSubmit();
          }
        }, this.getAutoSubmitDelay());
      });
    } else {
      this.clearCountdownStartTimeout();
      this.clearDelayTimeout();
      if (this.currentState !== VInputAutoSubmitState.Success && this.currentState !== VInputAutoSubmitState.Error) {
        this.setState(VInputAutoSubmitState.Idle);
      }
    }
  }

  public triggerSubmit(): void {
    if (!this.isEnabled()) return;
    if (!this.isValid()) return;
    if (this.currentState === VInputAutoSubmitState.Submitting) return;

    this.clearCountdownStartTimeout();
    this.clearDelayTimeout();
    this.setState(VInputAutoSubmitState.Submitting);
    this.emitSubmit(this.getValue());
  }

  public handleResult(result: VInputAutoSubmitResult): void {
    this.clearCountdownStartTimeout();
    this.clearDelayTimeout();

    if (result === VInputAutoSubmitResult.Success) {
      this.lastSubmittedValue = this.getValue();
      this.setState(VInputAutoSubmitState.Success);
      return;
    }

    this.setState(VInputAutoSubmitState.Error);
  }

  private setState(state: VInputAutoSubmitState): void {
    this.clearResetTimeout();
    this.currentState = state;
    this.onStateChange(state);

    if (state === VInputAutoSubmitState.Success || state === VInputAutoSubmitState.Error) {
      this.resetTimeoutId = setTimeout(() => {
        this.setState(VInputAutoSubmitState.Idle);
      }, DEFAULT_AUTO_SUBMIT_STATUS_FADE_OUT_DELAY);
    }
  }

  private clearCountdownStartTimeout(): void {
    if (this.countdownStartTimeoutId) {
      clearTimeout(this.countdownStartTimeoutId);
      this.countdownStartTimeoutId = null;
    }
  }

  private clearDelayTimeout(): void {
    if (this.delayTimeoutId) {
      clearTimeout(this.delayTimeoutId);
      this.delayTimeoutId = null;
    }
  }

  private clearResetTimeout(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
  }
}
