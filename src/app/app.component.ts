import { ChangeDetectionStrategy, Component, OnInit, afterNextRender } from "@angular/core";
import { Configuration } from "./shared/config";
import { AnimationService } from "./shared/services/animation.service";
import { GalleryService } from "./shared/services/gallery.service";
import { PreloadService } from "./shared/services/preload.service";
import { ScrollAnimationService } from "./shared/services/scrollAnimation.service";

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  fullscreen: boolean = false;
  /** Set after hydration, so the server HTML contains the page content instead of the intro overlay. */
  showIntro: boolean = false;
  config: Configuration;


  constructor(config: Configuration, private galleryService: GalleryService, private animationService: AnimationService, private preloadService: PreloadService, private scrollAnimationService: ScrollAnimationService) {
    this.config = config;
    // Browser-only: preloading images and starting the intro needs Image, sessionStorage and GSAP.
    afterNextRender(() => this.startBrowserExperience());
  }

  ngOnInit(): void {
    this.animationService.contentLoaded.subscribe(result => {
      this.scrollAnimationService.ActivateScrollService();
      this.scrollAnimationService.RegisterScrollServices();
    });

    this.getFullscreenState();
  }

  private startBrowserExperience(): void {
    this.config.setStartComponentNeeded();
    this.showIntro = this.config.getLoadingContentNeeded();
    if (this.showIntro) {
      // Let Angular render the intro overlay and subscribe to contentLoaded before the images start finishing.
      setTimeout(() => this.preloadImages());
    } else {
      this.preloadImages();
    }
  }

  getFullscreenState(): void {
    this.galleryService.fullscreenEvent.subscribe(result => {
      this.fullscreen = result;
    });
  }

  preloadImages(): void {
    this.preloadService.preloadImages();

    this.preloadService.loadComplated.subscribe(result => {
      this.waitLoadinScreen();
    });
  }

  waitLoadinScreen(): void {
    this.animationService.contentLoaded.emit(true);
  }
}
