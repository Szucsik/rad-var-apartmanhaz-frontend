import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit {
  @Input() context: string = '';
  @Input() startPageAnimation: boolean = false;

  @ViewChild('titleTextFirst', { static: true }) titleTextFirst: ElementRef<HTMLElement>;
  @ViewChild('titleImg', { static: true }) titleImg: ElementRef<HTMLElement>;
  @ViewChild('titleTextLast', { static: true }) titleTextLast: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit(): void {
    if(this.startPageAnimation)
      this.logoAnimations();
  }

  logoAnimations(): void {
    let screenWidth: number = window.innerWidth;
    let screenHeight: number = window.innerHeight;

    let animationX = 100;
    let animationY = 50;

    let X = screenWidth / 2 - 300;
    let Y = screenHeight / 2 - 200;

    let delay = 1.2;

    gsap.fromTo(this.titleTextFirst.nativeElement, {opacity: 0, y: Y + animationY, x: X + animationX}, {opacity: 1, duration: 1, ease: 'back', y: Y, x: X + animationX})
    gsap.fromTo(this.titleImg.nativeElement, {opacity: 0, y: Y - animationY, x: X + animationX}, {opacity: 1, duration: 1, ease: 'back', y: Y, x: X + animationX, delay: delay})

    delay++;
    gsap.fromTo(this.titleTextFirst.nativeElement, {x: X + animationX}, {duration: 1, ease: 'back',x: X, delay: delay})
    gsap.fromTo(this.titleImg.nativeElement, {x: X + animationX}, {duration: 1, ease: 'back',x: X, delay: delay})
    gsap.fromTo(this.titleTextLast.nativeElement, {opacity: 0, y: Y, x: X - animationX}, {opacity: 1, duration: 1, ease: 'back', y: Y, x: X, delay: delay});
  }
}
