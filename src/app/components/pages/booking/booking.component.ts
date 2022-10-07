import { Component, OnInit } from '@angular/core';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {

  constructor(private scrollAnimationService: ScrollAnimationService) { }

  ngOnInit(): void {
    this.scrollAnimationService.bookingScrollTrigger();
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
}
