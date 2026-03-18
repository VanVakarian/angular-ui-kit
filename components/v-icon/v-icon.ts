import { Component, computed, input } from '@angular/core';
import { CssUnitValue } from '@ui-kit/types';

export enum IconName {
  AccontBalanceWallet = 'account_balance_wallet',
  AccontBalance = 'account_balance',
  Add = 'add',
  Analytics = 'analytics',
  Article = 'article',
  Bar = 'bar',
  Cached = 'cached',
  CalendarMonth = 'calendar_month',
  CandlestickChart = 'candlestick_chart',
  Category = 'category',
  Check = 'check',
  ChevronLeft = 'chevron_left',
  CloseFullscreen = 'close_fullscreen',
  Close = 'close',
  CreditCard = 'credit_card',
  CurrencyBitcoin = 'currency_bitcoin',
  DarkMode = 'dark_mode',
  Delete = 'delete',
  Edit = 'edit',
  Enterprise = 'enterprise',
  FeaturedSeasonalAndGifts = 'featured_seasonal_and_gifts',
  History = 'history',
  Info = 'info',
  KeyboardArrowDown = 'keyboard_arrow_down',
  KeyboardArrowLeft = 'keyboard_arrow_left',
  KeyboardArrowRight = 'keyboard_arrow_right',
  KeyboardArrowUp = 'keyboard_arrow_up',
  LeftPanelClose = 'left_panel_close',
  LeftPanelOpen = 'left_panel_open',
  LightMode = 'light_mode',
  List = 'list',
  Login = 'login',
  Logout = 'logout',
  Menu = 'menu',
  Mic = 'mic',
  MoneyBag = 'money_bag',
  OpenInFull = 'open_in_full',
  OpenInNew = 'open_in_new',
  Paid = 'paid',
  PersonAdd = 'person_add',
  PhotoCamera = 'photo_camera',
  QuestionMark = 'question_mark',
  Refresh = 'refresh',
  Remove = 'remove',
  Restaurant = 'restaurant',
  Savings = 'savings',
  Scale = 'scale',
  Settings = 'settings',
  Star = 'star',
  SwapHoriz = 'swap_horiz',
  Undo = 'undo',
  UniversalCurrencyAlt = 'universal_currency_alt',
  UniversalCurrency = 'universal_currency',
  ViewCozy = 'view_cozy',
  Warning = 'warning',
}

@Component({
  selector: 'v-icon',
  templateUrl: './v-icon.html',
  styleUrl: './v-icon.css',
  host: {
    '[style.--v-icon-size]': 'iconUnitSizeString$$()',
    '[style.--v-icon-background]': 'iconBackgroundString$$()',
    '[style.--v-icon-color]': 'color()',
  },
})
export class VIcon {
  public readonly name = input.required<IconName>();
  public readonly size = input<CssUnitValue>(6);
  public readonly color = input<string>();

  public readonly iconBackgroundString$$ = computed(() => {
    return `url(ui-kit-assets/icons/${this.name()}.svg)`;
  });
  public readonly iconUnitSizeString$$ = computed(() => {
    return `var(--unit-${this.size()})`;
  });
}
