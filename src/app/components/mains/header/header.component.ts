import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild, ViewEncapsulation, computed, inject } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { I18nService, Language, LANGUAGES } from 'src/app/shared/services/i18n.service';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

type LanguageMenuDirection = 'left' | 'right';

const MOBILE_MEDIA_QUERY = '(max-width: 1023.98px)';

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
  readonly menuSections = ['gallery', 'booking', 'history', 'contacts'] as const;
  readonly languages = LANGUAGES;
  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  readonly currentLanguage = computed(() => this.languages.find(language => language.code === this.i18n.language()) ?? this.languages[0]);
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



  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.isLangMenuOpen && !this.langDial.nativeElement.contains(event.target as Node)) {
      this.isLangMenuOpen = false;
    }
  }

  toggleLangMenu(): void {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  // The items are real links (/hu, /en, …) so search engines find every language; clicks switch in place.
  async onLanguageClick(language: Language, event?: Event): Promise<void> {
    event?.preventDefault();
    this.isLangMenuOpen = false;
    await this.i18n.setLanguage(language.code);
    // Texts have different lengths in every language, so the scroll animation positions must be recalculated.
    setTimeout(() => this.scrollAnimationService.refresh());
  }

  // Staggers the items: they open from the button outwards and close in reverse order.
  getLangItemDelay(index: number): number {
    const step = 30;
    return this.isLangMenuOpen ? index * step : (this.languages.length - index - 1) * step;
  }

  showMobileMenu(): void {
    this.isMobileMenuActive  = !this.isMobileMenuActive;
  }
}


