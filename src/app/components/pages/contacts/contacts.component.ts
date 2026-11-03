import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
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
    this.isMobileResolution = window.matchMedia('(max-width: 1023.98px) and (orientation: portrait)').matches;
  }
}
