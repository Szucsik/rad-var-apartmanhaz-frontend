import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  @ViewChild('titleTextFirst', { static: true }) titleTextFirst: ElementRef<HTMLElement>;
  @ViewChild('titleImg', { static: true }) titleImg: ElementRef<HTMLElement>;
  @ViewChild('titleTextLast', { static: true }) titleTextLast: ElementRef<HTMLElement>;
  @ViewChild('main', { static: true }) maindiv: ElementRef<HTMLDivElement>;

  @ViewChild('outerBox', { static: true }) outerBox: ElementRef<HTMLDivElement>;
  @ViewChild('innerBox', { static: true }) innerBox: ElementRef<HTMLDivElement>;
  
  constructor() { }

  ngOnInit(): void {
    this.boxAnimations();
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

  boxAnimations(): void {
    gsap.fromTo(this.innerBox.nativeElement, {scale: 0.95 }, {scale: 1, duration: 5});
    gsap.fromTo(this.innerBox.nativeElement, {}, {yPercent: -100, delay: 3.2, duration: 1.5});
    gsap.fromTo(this.outerBox.nativeElement, {}, {yPercent: -100, delay: 3.3, duration: 1.5});
  }
}
