import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';

@Component({
  selector: 'app-logo-start',
  templateUrl: './logo-start.component.html',
  styleUrls: ['./logo-start.component.css']
})
export class LogoStartComponent implements OnInit {

  @Input() context: string = '';
  @Input() startPageAnimation: boolean = false;

  @ViewChild('titleTextFirst', { static: true }) titleTextFirst: ElementRef<HTMLElement>;
  @ViewChild('titleImg', { static: true }) titleImg: ElementRef<HTMLElement>;
  @ViewChild('titleTextLast', { static: true }) titleTextLast: ElementRef<HTMLElement>;

  constructor(private animationService: AnimationService) { }

  ngOnInit(): void {
    if(this.startPageAnimation)
      this.animationService.contentLoaded.subscribe(result => {
        this.animationService.logoAnimations(this.titleTextFirst, this.titleImg, this.titleTextLast);
      });
  }
}
