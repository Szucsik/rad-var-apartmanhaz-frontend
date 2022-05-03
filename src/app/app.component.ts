import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from "@angular/core";
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
    this.preloadService.preloadImages();
    this.preloadService.loadComplated.subscribe(result => {
      this.loaded = result;
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