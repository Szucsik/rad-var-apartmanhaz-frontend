import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Configuration } from "./shared/config";
import { AnimationService } from "./shared/services/animation.service";
import { PreloadService } from "./shared/services/preload.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  loaded: boolean = false;
  startAnimationFinished: boolean = false;

  config: Configuration;
  constructor(config: Configuration, private animationService: AnimationService, private preloadService: PreloadService, private router: Router) { this.config = config;}

  ngOnInit(): void {
    this.config.setStartComponentNeeded();
    this.preloadTasks();
  }

  
  preloadTasks(): void {
    this.correctURL();
    this.preloadImages();
  }

  correctURL(): void {
    if(!window.location.href.includes(this.config.getExpectedUrl()) && !window.location.href.includes(this.config.getDebugUrl())) {
      window.location.href = this.config.getExpectedUrl();
    }
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
