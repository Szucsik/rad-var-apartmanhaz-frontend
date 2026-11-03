import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { I18nService } from 'src/app/shared/services/i18n.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-nearby',
  templateUrl: './nearby.component.html',
  styleUrls: ['./nearby.component.scss']
})
export class NearbyComponent implements OnInit {
  protected readonly t = inject(I18nService).t;
  protected readonly tList = inject(I18nService).tList;

  constructor() { }

  ngOnInit(): void {
  }

}
