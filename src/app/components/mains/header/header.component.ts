import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

// Since update we need to define a type for speed dial (primeng)
export type Direction = "up" | "down" | "left" | "right" | "up-left" | "up-right" | "down-left" | "down-right";

enum directions {
  "up", "down", "left", "right", "up-left", "up-right", "down-left", "down-right"
}

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

  langDirection: 'up' | 'down' | 'left' | 'right' = 'left';
  items: MenuItem[];
  contextName: string = 'header';

  isMobileResolution: boolean = false;
  isMobileMenuActive: boolean = false;

  constructor(private primengConfig: PrimeNGConfig, private animationService: AnimationService, private _scrollAnimationService: ScrollAnimationService) { this.scrollAnimationService = _scrollAnimationService; }

  ngOnInit(): void {
    if(window.innerWidth < 1300) {
      this.langDirection = 'right';
      this.isMobileResolution = true;
    }

    this.animationService.contentLoaded.subscribe(result => {
      this.animationService.headerAnimations(this.container);
    });

    this.languageCompSetUp();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerHeight > window.innerWidth) {
      this.langDirection = 'right';
      this.isMobileResolution = true;
    } else {
      this.langDirection = 'left';
      this.isMobileResolution = false;
    }
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    this.isMobileMenuActive = false;
  }

  languageCompSetUp(): void {
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

  showMobileMenu(): void {
    this.isMobileMenuActive  = !this.isMobileMenuActive;
  }

  getLanguageItems(): void {

  }

  setLanguage(): void {

  }
}


