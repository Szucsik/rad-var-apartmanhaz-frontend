import { ChangeDetectionStrategy, Component, HostListener, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  protected readonly t = inject(I18nService).t;
  private readonly platformId = inject(PLATFORM_ID);
  maxFocus: number = 3;
  focus: number = 0;
  mobileMod: boolean = false;
  
  constructor(private scrollAnimationService: ScrollAnimationService) { }

  @HostListener('window:resize')
  onResize() {
    this.CheckResolutionForAnimation();
  }

  ngOnInit(): void {
    // this.scrollAnimationService.bookingScrollTrigger();
    this.CheckResolutionForAnimation();
  }

  RedirectLink(target: string): void {
    switch(target) {
      case 'booking': {
        window.open("https://www.booking.com/hotel/hu/rad-var-apartmanhaz.hu.html", "_blank");
        break;
      }
      case 'szallas': {
        window.open("https://szallas.hu/rad-var-apartmanhaz-eger", "_blank");
        break;
      }
      case 'facebook': {
        this.scrollAnimationService.navigate('contacts')
        break;
      }
    }
  }

  SwapFocus(target: string): void {
    switch(target) {
      case 'left': {
        if(this.focus < this.maxFocus - 1) {
          this.focus++;
        } else {
          this.focus = 0;
        }
        break;
      }
      case 'right': {
        if(this.focus > 0) {
          this.focus--;
        } else {
          this.focus = this.maxFocus - 1;
        }
        break;
      }
    }
  }

  // One card at a time (with the swap arrows) below the desktop breakpoint; keep in sync with $desktop-breakpoint.
  CheckResolutionForAnimation(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.mobileMod = window.matchMedia('(max-width: 1023.98px)').matches;
  }
}
