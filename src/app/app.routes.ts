import { Routes } from '@angular/router';
import { Food } from './components/ui-showcase/pages/food/food';
import { Icons } from './components/ui-showcase/pages/icons/icons';
import { Money } from './components/ui-showcase/pages/money/money';
import { Other } from './components/ui-showcase/pages/other/other';
import { Settings } from './components/ui-showcase/pages/settings/settings';
import { UiShowcase } from './components/ui-showcase/ui-showcase';

export const routes: Routes = [
  {
    path: 'ui-showcase',
    component: UiShowcase,
    children: [
      { path: 'dishes', component: Food },
      { path: 'finance', component: Money },
      { path: 'icons', component: Icons },
      { path: 'other', component: Other },
      { path: 'settings', component: Settings },
      { path: '', redirectTo: 'other', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'ui-showcase', pathMatch: 'full' },
  { path: '**', redirectTo: 'ui-showcase', pathMatch: 'full' },
];
