import { AbstractControl } from '@angular/forms';
import { rangeValidator, weightValidator } from './validators';

function control(value: unknown): AbstractControl {
  return { value } as AbstractControl;
}

describe('rangeValidator', () => {
  it('returns null for empty value (but not 0)', () => {
    expect(rangeValidator(1, 10)(control(''))).toBeNull();
    expect(rangeValidator(1, 10)(control(null))).toBeNull();
  });

  it('treats 0 as a real value to validate, not empty', () => {
    expect(rangeValidator(1, 10)(control(0))).toEqual({ range: { min: 1, max: 10, actual: 0 } });
  });

  it('returns null for a non-numeric value', () => {
    expect(rangeValidator(1, 10)(control('abc'))).toBeNull();
  });

  it('returns null when the value is within [min, max] inclusive', () => {
    expect(rangeValidator(1, 10)(control(1))).toBeNull();
    expect(rangeValidator(1, 10)(control(10))).toBeNull();
    expect(rangeValidator(1, 10)(control(5))).toBeNull();
  });

  it('returns a range error when the value is below min', () => {
    expect(rangeValidator(1, 10)(control(0.5))).toEqual({ range: { min: 1, max: 10, actual: 0.5 } });
  });

  it('returns a range error when the value is above max', () => {
    expect(rangeValidator(1, 10)(control(11))).toEqual({ range: { min: 1, max: 10, actual: 11 } });
  });
});

describe('weightValidator', () => {
  it('returns null for empty value (but not 0)', () => {
    expect(weightValidator()(control(''))).toBeNull();
    expect(weightValidator()(control(null))).toBeNull();
  });

  it('accepts a 2-digit integer weight', () => {
    expect(weightValidator()(control('70'))).toBeNull();
  });

  it('accepts a 3-digit integer weight', () => {
    expect(weightValidator()(control('120'))).toBeNull();
  });

  it('accepts one decimal digit with dot or comma', () => {
    expect(weightValidator()(control('70.5'))).toBeNull();
    expect(weightValidator()(control('70,5'))).toBeNull();
  });

  it('rejects a single-digit weight', () => {
    expect(weightValidator()(control('7'))).toEqual({
      bodyWeight: { requiredPattern: expect.any(String), actualValue: '7' },
    });
  });

  it('rejects more than one decimal digit', () => {
    expect(weightValidator()(control('70.55'))).toEqual({
      bodyWeight: { requiredPattern: expect.any(String), actualValue: '70.55' },
    });
  });

  it('rejects non-numeric input', () => {
    expect(weightValidator()(control('abc'))).toEqual({
      bodyWeight: { requiredPattern: expect.any(String), actualValue: 'abc' },
    });
  });
});
