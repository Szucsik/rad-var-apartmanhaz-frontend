import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration } from 'src/app/shared/config';
import { AnimationService } from 'src/app/shared/services/animation.service';

@Component({
  standalone: false,
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('content', { static: true }) content: ElementRef<HTMLElement>;

  hideOverflow: boolean = true;
  
  constructor(private config: Configuration, private animationService: AnimationService) { }

  ngOnInit(): void {
    this.animationService.contentLoaded.subscribe(result => {
      this.animationService.homeAnimations(this.content); 
      this.setLoadingContainer();
    });
  }

    // Turns off the loading container after Start component animation finished
    async setLoadingContainer() {
      await delayExec(this.config.getContentDelay() * 1000);
      this.config.setStartAnimationsCompleted();
  }
}

function delayExec(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
