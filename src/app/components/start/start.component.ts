import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { Configuration } from 'src/app/shared/config';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})

export class StartComponent implements OnInit {
  contextName: string = 'start';  
  config: Configuration;
  
  @ViewChild('outerBox', { static: true }) outerBox: ElementRef<HTMLDivElement>;
  @ViewChild('innerBox', { static: true }) innerBox: ElementRef<HTMLDivElement>;
  
  constructor(config: Configuration) { this.config = config;}

  ngOnInit(): void {
    this.boxAnimations(this.config.getStartDelay());
  }

  boxAnimations(delay: number): void {
    let rollUpDuration: number = 1.5;
    gsap.fromTo(this.innerBox.nativeElement, {scale: 0.95 }, {scale: 1, duration: delay + rollUpDuration});
    gsap.fromTo(this.innerBox.nativeElement, {}, {yPercent: -100, delay: delay, duration: rollUpDuration});
    gsap.fromTo(this.outerBox.nativeElement, {}, {yPercent: -100, delay: delay + 0.1, duration: rollUpDuration});
  }
}
