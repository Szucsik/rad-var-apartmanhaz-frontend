import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  constructor(private animationService: AnimationService, private scrollAnimationService: ScrollAnimationService) { }

  ngOnInit(): void {
    this.animationService.contentLoaded.subscribe(result => {
      this.scrollAnimationService.homeScrollTrigger();
    });
  }
}
