import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Configuration } from "./shared/config";
import { AnimationService } from "./shared/services/animation.service";
import { PreloadService } from "./shared/services/preload.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  @ViewChild('main', { static: true }) container: ElementRef<HTMLDivElement>;
  
  enableLoadingContainer: boolean = true;
  loaded: boolean = false;

  config: Configuration;
  constructor(config: Configuration, private animationService: AnimationService, private preloadService: PreloadService) { this.config = config;}

  ngOnInit(): void {
    this.config.setStartComponentNeeded();
    this.preloadImages();
  }

  preloadImages(): void {
    this.preloadService.preloadStartImages();
    this.preloadService.loadStartComplated.subscribe(result => {
      this.loaded = result;
      this.preloadService.preloadImages();
      this.animationService.startContentLoaded.emit(result);
    });

    this.preloadService.loadComplated.subscribe(result => {
      this.animationService.contentLoaded.emit(result);
      this.setLoadingContainer();
    });
  }

  // Turns off the loading container after Start component animation finished
  async setLoadingContainer() {
      await delayExec(this.config.getContentDelay() * 1000);
      this.config.setStartAnimationsCompleted();
      this.enableLoadingContainer = !this.config.getStartAnimationsCompleted();
  }
}

function delayExec(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}