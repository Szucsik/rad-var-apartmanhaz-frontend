import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HeaderComponent implements OnInit {
  @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;

  scrollAnimationService: ScrollAnimationService;

  mainLangClass: string;
  items: MenuItem[];
  contextName: string = 'header';
  
  constructor(private primengConfig: PrimeNGConfig, private animationService: AnimationService, private _scrollAnimationService: ScrollAnimationService) { this.scrollAnimationService = _scrollAnimationService; }

  ngOnInit(): void {
    this.animationService.contentLoaded.subscribe(result => {
      this.animationService.headerAnimations(this.container);
    });

    this.primengConfig.ripple = true;
    this.items = [
      {
        icon: 'lang-hun-icon lang-icon',
        command: () => {
            
        }
      },
      {
          icon: 'lang-pol-icon lang-icon',
          command: () => {
              
          }
      },
      {
          icon: 'lang-eng-icon lang-icon',
          command: () => {
              
          }
      },
      {
          icon: 'lang-ger-icon lang-icon',
          command: () => {
              
          }
      }
    ];
  }

  getLanguageItems(): void {

  }

  setLanguage(): void {

  }
}


