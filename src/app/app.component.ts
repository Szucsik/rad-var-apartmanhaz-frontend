import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Configuration } from "./shared/config";
import { AnimationService } from "./shared/services/animation.service";
import { GalleryService } from "./shared/services/gallery.service";
import { PreloadService } from "./shared/services/preload.service";
import { ScrollAnimationService } from "./shared/services/scrollAnimation.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  loaded: boolean = false;
  fullscreen: boolean = false;
  startAnimationFinished: boolean = false;
  config: Configuration;


  constructor(config: Configuration, private galleryService: GalleryService, private animationService: AnimationService, private preloadService: PreloadService, private scrollAnimationService: ScrollAnimationService) { this.config = config;}

  ngOnInit(): void {
    this.config.setStartComponentNeeded();
    this.preloadTasks();

    this.animationService.contentLoaded.subscribe(result => {
      this.scrollAnimationService.ActivateScrollService();
      this.scrollAnimationService.RegisterScrollServices();
    });
  }
  
  preloadTasks(): void {
    this.preloadImages();
    this.getFullscreenState();
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

  async waitLoadinScreen() {
    this.loaded = true;
    this.animationService.contentLoaded.emit(true);
    if(this.config.getLoadingContentNeeded()) await this.animationService.delayExec(this.config.getStartDelay() * 1000);
    this.startAnimationFinished = true;
  }
}
