import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VButton } from '@ui-kit/components/v-button/v-button';
import { VCard } from '@ui-kit/components/v-card/v-card';

@Component({
  selector: 'v-card-page',
  templateUrl: './v-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VCard, VButton],
})
export class VCardPage {}
