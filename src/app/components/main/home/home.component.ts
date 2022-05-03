import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { DivBgs } from 'src/app/shared/services/imageLazyLoading/divBgs.collection';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  divBgs = DivBgs;
  @ViewChild('content', { static: true }) content: ElementRef<HTMLElement>;

  constructor(private animationService: AnimationService) { }

  ngOnInit(): void {
    this.animationService.contentLoaded.subscribe(result => {
      this.animationService.homeScrollTrigger();
      this.animationService.homeAnimations(this.content); 
    });
  }
}
