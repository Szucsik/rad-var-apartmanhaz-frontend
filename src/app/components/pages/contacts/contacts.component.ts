import { ChangeDetectionStrategy, Component, HostListener, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { I18nService } from 'src/app/shared/services/i18n.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  protected readonly t = inject(I18nService).t;
  private readonly platformId = inject(PLATFORM_ID);
  constructor() { }
  isMobileResolution: boolean = false;

  openLink(url: string): void {
    window.open(url, "_blank");
  }

  ngOnInit(): void {
    this.onResize();
  }

  // Portrait map on narrow screens; keep in sync with the 1024px breakpoint in contacts.component.css.
  @HostListener('window:resize')
  onResize() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.isMobileResolution = window.matchMedia('(max-width: 1023.98px) and (orientation: portrait)').matches;
  }
}
