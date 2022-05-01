import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { Configuration } from "./shared/config";
import { AnimationService } from "./shared/services/animation.service";

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
  constructor(config: Configuration, private animationService: AnimationService) { this.config = config;}

  ngOnInit(): void {
    this.config.setStartComponentNeeded();
    this.setLoadingContainer();
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
  }
}

function delayExec(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}