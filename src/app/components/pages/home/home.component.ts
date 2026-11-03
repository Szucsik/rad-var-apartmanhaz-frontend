import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from 'src/app/shared/services/i18n.service';
@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent  {
  protected readonly t = inject(I18nService).t;
  constructor() { }
}
