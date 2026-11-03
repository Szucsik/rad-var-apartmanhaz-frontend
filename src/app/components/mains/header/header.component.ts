import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

type LanguageMenuDirection = 'left' | 'right';

const MOBILE_MEDIA_QUERY = '(max-width: 1023.98px)';

interface LanguageMenuItem {
  icon: string;
  command: () => void;
}

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class HeaderComponent implements OnInit {
  @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;
  @ViewChild('langDial', { static: true }) langDial: ElementRef<HTMLElement>;

  scrollAnimationService: ScrollAnimationService;

  langDirection: LanguageMenuDirection = "left";
  items: LanguageMenuItem[];
  isLangMenuOpen: boolean = false;
  contextName: string = 'header';

  isMobileResolution: boolean = false;
  isMobileMenuActive: boolean = false;

  constructor(private animationService: AnimationService, private _scrollAnimationService: ScrollAnimationService) { this.scrollAnimationService = _scrollAnimationService; }

  ngOnInit(): void {
    this.updateResolution();

    this.animationService.contentLoaded.subscribe(result => {
      this.animationService.headerAnimations(this.container);
    });

    this.languageCompSetUp();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.updateResolution();
  }

  // Keep in sync with $desktop-breakpoint in shared/scss/sizes.scss.
  private updateResolution(): void {
    this.isMobileResolution = window.matchMedia(MOBILE_MEDIA_QUERY).matches;
    if (!this.isMobileResolution) {
      this.isMobileMenuActive = false;
    }
  }

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    this.isMobileMenuActive = false;
  }

  languageCompSetUp(): void {
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isLangMenuOpen && !this.langDial.nativeElement.contains(event.target as Node)) {
      this.isLangMenuOpen = false;
    }
  }

  toggleLangMenu(): void {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  onLangItemClick(item: LanguageMenuItem): void {
    item.command();
    this.isLangMenuOpen = false;
  }

  // Staggers the items: they open from the button outwards and close in reverse order.
  getLangItemDelay(index: number): number {
    const step = 30;
    return this.isLangMenuOpen ? index * step : (this.items.length - index - 1) * step;
  }

  showMobileMenu(): void {
    this.isMobileMenuActive  = !this.isMobileMenuActive;
  }

  getLanguageItems(): void {

  }

  setLanguage(): void {

  }
}


