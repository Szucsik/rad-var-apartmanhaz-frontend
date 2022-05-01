import { AfterViewChecked, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})

export class StartComponent implements OnInit, AfterViewChecked {
  @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  @ViewChild('outerBox', { static: true }) outerBox: ElementRef<HTMLDivElement>;
  @ViewChild('innerBox', { static: true }) innerBox: ElementRef<HTMLDivElement>;

  contextName: string = 'start';  
  
  constructor(private animationService: AnimationService) { }

  ngOnInit(): void {
    this.animationService.contentLoaded.subscribe(result => {
      this.animationService.startAnimations(this.outerBox, this.innerBox);
    });
  }

  ngAfterViewChecked(): void {
    this.finishedLoading.emit(true)
  }
}
