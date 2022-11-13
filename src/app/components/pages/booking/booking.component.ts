import { Component, OnInit } from '@angular/core';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  maxFocus: number = 3;
  focus: number = 0;
  mobileMod: boolean = false;
  
  constructor(private scrollAnimationService: ScrollAnimationService) { }

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

  CheckResolutionForAnimation(): void {
    if(window.innerHeight > window.innerWidth)
      this.mobileMod = true;
    else 
      this.mobileMod = false;
  }
}
