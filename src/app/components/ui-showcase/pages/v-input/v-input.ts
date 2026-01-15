import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VButton } from '@ui-kit/components/v-button/v-button';
import { IconName, VIcon } from '@ui-kit/components/v-icon/v-icon';
import { VInput } from '@ui-kit/components/v-input/v-input';

@Component({
  selector: 'v-input-page',
  templateUrl: './v-input.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VInput, ReactiveFormsModule, VButton, VIcon],
})
export class VInputPage {
  protected readonly Icon = IconName;

  protected readonly form = new FormGroup({
    testInput: new FormControl(''),
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    disabled: new FormControl({ value: '', disabled: true }),
    error: new FormControl('', Validators.required),
  });

  protected consoleLogFormValue(): void {
    console.log(this.form.value);
  }
}
