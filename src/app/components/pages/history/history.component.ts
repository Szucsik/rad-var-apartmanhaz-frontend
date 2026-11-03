import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { I18nService } from 'src/app/shared/services/i18n.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  protected readonly t = inject(I18nService).t;
  // Keys of the pages under history.pages in the language files, in page order.
  readonly topics = ['intro', 'residents', 'recent'] as const;
  inactivePages: Array<boolean> = [ true, true, true]
  focus: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  changeFocus(id: number): void {
    this.focus = id;
    this.inactivePages[id] = false;
    for(let i = 0; i < this.inactivePages.length; i++) {
      if(i != id) {
        this.inactivePages[i] = true;
      }
    }
  }
}
