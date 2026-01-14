import { computed, inject, Injectable, signal } from '@angular/core';

import { DeviceInfoService } from '@app/services/device-info.service';
import { RouterService } from '@app/services/router.service';
import { IconName } from '@ui-kit/components/v-icon/v-icon';

enum MenuPlace {
  Mobile = 'mobile',
  Desktop = 'desktop',
  Both = 'both',
}

enum MenuWidthPx {
  Collapsed = 60,
  Expanded = 242,
}

export interface MenuButton {
  label: string;
  place: MenuPlace;
  link: string | string[];
  selected?: boolean;
  iconName: IconName;
  bgClass?: string;
}

export interface UiShowcaseButton {
  label: string;
  link: string;
  iconName: IconName;
  selected: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly COLLAPSE_STORAGE_KEY = 'navbar-collapsed';

  private readonly isNavbarCollapsed$$ = signal(true);
  private readonly currentRoute$signal = signal('');
  private readonly deviceInfoService = inject(DeviceInfoService);

  public readonly isCollapsed$$ = computed(() => this.isNavbarCollapsed$$());

  public readonly navbarWidth$$ = computed(() => {
    if (!this.deviceInfoService.isDesktopScreen$$()) return 0;
    return this.isNavbarCollapsed$$() ? MenuWidthPx.Collapsed : MenuWidthPx.Expanded;
  });

  public readonly currentRoute$$ = computed(() => this.currentRoute$signal());

  public readonly shouldShowUiShowcaseButtons$$ = computed(() => {
    return this.currentRoute$$().startsWith('/ui-showcase');
  });

  public readonly visibleUiShowcaseButtons$$ = computed(() => {
    return this.shouldShowUiShowcaseButtons$$() ? this.uiShowcaseButtons : [];
  });

  private readonly buttons: MenuButton[] = [];

  private readonly uiShowcaseButtons: UiShowcaseButton[] = [
    {
      label: 'Dishes',
      link: '/ui-showcase/dishes',
      iconName: IconName.Restaurant,
      selected: false,
    },
    {
      label: 'Finance',
      link: '/ui-showcase/finance',
      iconName: IconName.Paid,
      selected: false,
    },
    {
      label: 'Icons',
      link: '/ui-showcase/icons',
      iconName: IconName.ViewCozy,
      selected: false,
    },
    {
      label: 'Other',
      link: '/ui-showcase/other',
      iconName: IconName.Article,
      selected: false,
    },
  ];

  private readonly routerService = inject(RouterService);

  constructor() {
    this.subscribeToRouteChanges();
    this.initCollapseState();
  }

  public toggleCollapse(): void {
    this.isNavbarCollapsed$$.set(!this.isNavbarCollapsed$$());
    localStorage.setItem(this.COLLAPSE_STORAGE_KEY, String(this.isNavbarCollapsed$$()));
  }

  private initCollapseState(): void {
    const saved = localStorage.getItem(this.COLLAPSE_STORAGE_KEY);
    this.isNavbarCollapsed$$.set(saved === null ? true : saved === 'true');
  }

  public prepButtons(place: 'mobile' | 'desktop'): MenuButton[] {
    return this.buttons.filter((button) => {
      return button.place === place || button.place === 'both';
    });
  }

  private subscribeToRouteChanges() {
    this.routerService.currentRoute$.subscribe((route) => {
      this.currentRoute$signal.set(route);

      this.buttons.forEach((btn) => {
        if (btn.hasOwnProperty('selected')) {
          if (Array.isArray(btn.link)) {
            btn.selected = btn.link.some((link) => route.includes(link));
          } else {
            btn.selected = route.includes(btn.link);
          }
        }
      });

      this.uiShowcaseButtons.forEach((btn) => {
        btn.selected = route.includes(btn.link);
      });
    });
  }
}
