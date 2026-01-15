import { NgClass } from '@angular/common';
import { Component, computed, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceInfoService } from '@app/services/device-info.service';
import { MenuButton, NavigationService, UiShowcaseButton } from '@app/services/navigation.service';
import { VButton } from '@ui-kit/components/v-button/v-button';
import { IconName, VIcon } from '@ui-kit/components/v-icon/v-icon';
import { ButtonStyle } from '@ui-kit/types';

@Component({
  selector: 'navigation',
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
  imports: [VButton, VIcon, NgClass],
})
export class Navigation implements OnInit {
  protected readonly fader = viewChild.required<ElementRef>('fader');

  protected readonly Icon = IconName;
  protected readonly ButtonStyle = ButtonStyle;

  protected readonly isMobileMenuOpen$$ = signal(false);

  protected readonly navigationService = inject(NavigationService);
  private readonly deviceInfoService = inject(DeviceInfoService);
  private readonly router = inject(Router);

  protected readonly isDesktop$$ = computed(() => this.deviceInfoService.isDesktopScreen$$());

  protected readonly shouldHideFabButtons$$ = computed(
    () => !this.isDesktop$$() && this.deviceInfoService.isKeyboardOpen$$()
  );

  protected readonly visibleButtons$$ = computed(() => {
    const place = this.isDesktop$$() ? 'desktop' : 'mobile';
    return this.navigationService.prepButtons(place);
  });

  protected readonly uiShowcaseButtons$$ = this.navigationService.visibleUiShowcaseButtons$$;
  protected readonly forceShowOnUiShowcasePage$$ = this.navigationService.shouldShowUiShowcaseButtons$$;

  public ngOnInit(): void {}

  protected getButtonStyle(button: MenuButton | UiShowcaseButton): ButtonStyle {
    return button.selected ? ButtonStyle.Raised : ButtonStyle.Flat;
  }

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen$$.update((value) => !value);
    if (this.isMobileMenuOpen$$()) {
      this.fader().nativeElement.classList.remove('hidden');
    } else {
      this.fader().nativeElement.classList.add('hidden');
    }
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen$$.set(false);
    this.fader().nativeElement.classList.add('hidden');
  }

  protected navigateToLink(link: string | string[]): void {
    if (Array.isArray(link)) {
      this.router.navigate(link);
    } else if (link) {
      this.router.navigate([link]);
    }
  }
}
