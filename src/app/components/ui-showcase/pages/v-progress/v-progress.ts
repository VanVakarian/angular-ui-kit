import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgressBarStyle, VProgress } from '@ui-kit/components/v-progress/v-progress';

@Component({
  selector: 'v-progress-page',
  templateUrl: './v-progress.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VProgress],
})
export class VProgressPage {
  protected readonly ProgressBarStyle = ProgressBarStyle;
}
