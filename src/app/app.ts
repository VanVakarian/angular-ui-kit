import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navigation } from '@app/components/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('ui-kit');
}
