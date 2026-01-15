import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconName, VIcon } from '@ui-kit/components/v-icon/v-icon';

@Component({
  selector: 'v-icon-page',
  templateUrl: './v-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VIcon],
})
export class VIconPage {
  protected readonly Icon = IconName;
  protected readonly iconNames = Object.values(IconName);

  protected getIconKey(iconName: IconName): string {
    return (
      Object.keys(IconName).find((key) => IconName[key as keyof typeof IconName] === iconName) ||
      iconName
    );
  }

  protected async copyIconName(iconName: IconName): Promise<void> {
    try {
      const iconKey = this.getIconKey(iconName);
      await navigator.clipboard.writeText(iconKey);
    } catch {}
  }
}
