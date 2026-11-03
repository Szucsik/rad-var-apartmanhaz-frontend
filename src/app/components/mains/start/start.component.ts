import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})

export class StartComponent implements OnInit {
  @ViewChild('outerBox', { static: true }) outerBox: ElementRef<HTMLDivElement>;
  @ViewChild('innerBox', { static: true }) innerBox: ElementRef<HTMLDivElement>;

  contextName: string = 'start';  
  
  constructor(private animationService: AnimationService) { }

  ngOnInit(): void {
    this.animationService.contentLoaded.subscribe((result) => {
      this.animationService.startAnimations(this.outerBox, this.innerBox);
    });
  }
}
