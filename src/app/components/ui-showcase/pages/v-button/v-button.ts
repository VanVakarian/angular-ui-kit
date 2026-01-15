import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VButton } from '@ui-kit/components/v-button/v-button';
import { IconName, VIcon } from '@ui-kit/components/v-icon/v-icon';

@Component({
  selector: 'v-button-page',
  templateUrl: './v-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VButton, VIcon],
})
export class VButtonPage {
  protected readonly Icon = IconName;
}
