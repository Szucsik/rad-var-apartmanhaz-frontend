import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})

export class StartComponent implements OnInit {
  contextName: string = 'start';
  @ViewChild('outerBox', { static: true }) outerBox: ElementRef<HTMLDivElement>;
  @ViewChild('innerBox', { static: true }) innerBox: ElementRef<HTMLDivElement>;
  
  constructor() { }

  ngOnInit(): void {
    this.boxAnimations();
  }

  boxAnimations(): void {
    gsap.fromTo(this.innerBox.nativeElement, {scale: 0.95 }, {scale: 1, duration: 5});
    gsap.fromTo(this.innerBox.nativeElement, {}, {yPercent: -100, delay: 3.2, duration: 1.5});
    gsap.fromTo(this.outerBox.nativeElement, {}, {yPercent: -100, delay: 3.3, duration: 1.5});
  }
}
