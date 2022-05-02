import { ImageLazyLoadingService } from './shared/services/imageLazyLoading/imageLazyLoading.service';
import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { Configuration } from "./shared/config";
import { AnimationService } from "./shared/services/animation.service";
import { ImageVars } from './shared/services/imageLazyLoading/imagevars';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  @ViewChild('main', { static: true }) container: ElementRef<HTMLDivElement>;
  
  enableLoadingContainer: boolean = true;
  containersLoaded: number = 0;
  contentLoaded: EventEmitter<boolean> = new EventEmitter();

  config: Configuration;
  constructor(config: Configuration, private animationService: AnimationService, private imageLazyLoadingService: ImageLazyLoadingService) { this.config = config;}

  ngOnInit(): void {
    this.config.setStartComponentNeeded();
    this.setLoadingContainer();

    ImageVars.loaded.subscribe(result => {
      this.imageLazyLoadingService.loadAllImages();
    });
  }

  childLoadingFinished(): void {
    this.containersLoaded++;

    if(this.containersLoaded == this.container.nativeElement.children.length) {
      this.animationService.contentLoaded.emit(true);
    }
  }

  // Turns off the loading container after Start component animation finished
  async setLoadingContainer() {
      await delayExec(this.config.getContentDelay() * 1000);
      this.config.setStartAnimationsCompleted();
      this.enableLoadingContainer = !this.config.getStartAnimationsCompleted();
      this.imageLazyLoadingService.preloadAll();
  }
}

function delayExec(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}