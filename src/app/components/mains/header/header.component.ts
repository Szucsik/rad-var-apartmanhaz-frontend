import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
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

  langDirection: string = "left";
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
    if(window.innerWidth < 1300) {
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


