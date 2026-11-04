import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, PLATFORM_ID, QueryList, ViewChild, ViewChildren, effect, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { I18nService } from 'src/app/shared/services/i18n.service';

// Keep in sync with $wide-breakpoint in shared/scss/sizes.scss.
const WIDE_MEDIA_QUERY = '(min-width: 1280px)';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {
  @ViewChild('timeline', { static: true }) timeline: ElementRef<HTMLElement>;
  @ViewChildren('timelineText') timelineTexts: QueryList<ElementRef<HTMLElement>>;

  protected readonly i18n = inject(I18nService);
  protected readonly t = this.i18n.t;
  // Keys of the pages under history.pages in the language files, in page order.
  readonly topics = ['intro', 'residents', 'recent'] as const;
  inactivePages: Array<boolean> = [ true, true, true]
  focus: number = 0;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly wideViewport = this.isBrowser ? window.matchMedia(WIDE_MEDIA_QUERY) : null;

  constructor() {
    // The labels change length with the language: wait until the new texts are rendered, then size once for all of them.
    effect(() => {
      this.i18n.language();
      if (this.isBrowser) {
        setTimeout(() => this.fitTimelineWidth());
      }
    });
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }
    // The first measurement can run before the web font is ready and use fallback metrics, so measure again afterwards.
    void document.fonts?.ready.then(() => this.fitTimelineWidth());
    // Rotating a tablet can cross the breakpoint where the timeline becomes visible.
    this.wideViewport?.addEventListener('change', this.fitTimelineWidth);
  }

  ngOnDestroy(): void {
    this.wideViewport?.removeEventListener('change', this.fitTimelineWidth);
  }

  // Gives every pill the width of the longest label in the current language, so switching topic does not resize it.
  private readonly fitTimelineWidth = (): void => {
    const texts = this.timelineTexts?.map(ref => ref.nativeElement) ?? [];
    // Below the wide breakpoint the timeline is display:none, so there is nothing to measure.
    if (!this.isBrowser || !this.timeline || !texts.length || !texts[0].getClientRects().length) {
      return;
    }

    const width = Math.max(...texts.map(text => {
      const range = document.createRange();
      range.selectNodeContents(text);
      const style = getComputedStyle(text);
      return range.getBoundingClientRect().width + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }));

    // vw keeps the pill in proportion with the vw font size when the window is resized.
    this.timeline.nativeElement.style.setProperty('--timeline-highlight-pill-width', `${width / window.innerWidth * 100}vw`);
  };

  changeFocus(id: number): void {
    this.focus = id;
    this.inactivePages[id] = false;
    for(let i = 0; i < this.inactivePages.length; i++) {
      if(i != id) {
        this.inactivePages[i] = true;
      }
    }
  }
}
