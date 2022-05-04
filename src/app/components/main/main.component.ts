import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('content', { static: true }) content: ElementRef<HTMLElement>;
  
  constructor(private animationService: AnimationService) { }

  ngOnInit(): void {
    this.animationService.contentLoaded.subscribe(result => {
      this.animationService.homeAnimations(this.content); 
    });
  }
}
