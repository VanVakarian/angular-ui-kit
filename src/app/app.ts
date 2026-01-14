import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from '@app/components/navigation/navigation';
import { NavigationService } from '@app/services/navigation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ui-kit');
  protected readonly navigationService = inject(NavigationService);
}
