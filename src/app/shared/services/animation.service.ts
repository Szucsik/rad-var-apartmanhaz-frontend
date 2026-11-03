import { ElementRef, EventEmitter, Injectable } from "@angular/core";
import { Configuration } from "../config";
import { gsap } from 'gsap';


@Injectable({
    providedIn: 'root',
})

export class AnimationService {
    contentLoaded: EventEmitter<boolean> = new EventEmitter();
    galleryAnimationCompleted: EventEmitter<boolean> = new EventEmitter();
    
    constructor(private config: Configuration) { }

    startAnimations(outerBox: ElementRef<HTMLDivElement>, innerBox: ElementRef<HTMLDivElement>): void {
        let delay: number = this.config.getStartDelay();
        let rollUpDuration: number = 1.5;

        gsap.fromTo(innerBox.nativeElement, {scale: 0.95 }, {scale: 1, duration: delay + rollUpDuration});
        gsap.fromTo(innerBox.nativeElement, {}, {yPercent: -100, delay: delay, duration: rollUpDuration});
        gsap.fromTo(outerBox.nativeElement, {}, {yPercent: -100, delay: delay + 0.1, duration: rollUpDuration});
    }

    logoAnimations(titleTextFirst: ElementRef<HTMLElement>, titleImg: ElementRef<HTMLElement>, titleTextLast: ElementRef<HTMLElement>): void {
        let castleImg = titleImg.nativeElement;
        let firstTxt = titleTextFirst.nativeElement;
        let lastTxt = titleTextLast.nativeElement;

        let screenWidth: number = window.innerWidth;
        let screenHeight: number = window.innerHeight;
    
        let animationX = 100;
    
        let X = screenWidth / 2;
        let Y = screenHeight / 2;

        let castleY = Y - castleImg.offsetHeight / 2;
        let castleX = X - castleImg.offsetWidth / 2;

        let firstY = castleY;
        let firstX = X - firstTxt.offsetWidth / 2;

        let lastY = castleY;
        let lastX = X - lastTxt.offsetWidth / 2 + X / 15;

        let delay = 1;

    
        gsap.fromTo(castleImg, {opacity: 0, y: castleY, x: castleX}, {opacity: 1, duration: 1})
        gsap.fromTo(firstTxt, {opacity: 0, y: firstY, x: firstX}, {opacity: 1, duration: 1, delay: delay})
    
        delay += 0.5;
        gsap.fromTo(lastTxt, {opacity: 0, y:lastY, x: lastX}, {opacity: 1, duration: 1, delay: delay});

        delay++;
        gsap.fromTo(castleImg, {}, {duration: 1, opacity: 0, delay: delay})
        gsap.fromTo(firstTxt, {}, {duration: 1, opacity: 0, delay: delay})
        gsap.fromTo(lastTxt, {}, {duration: 1, opacity: 0, delay: delay})
      }

      homeAnimations(content: ElementRef<HTMLElement>): void {
        let delay: number = this.config.getContentDelay();
        gsap.fromTo(content.nativeElement, {opacity: 0}, {opacity: 1, duration: 1, delay: delay, onComplete: this.config.setStartAnimationsCompleted});
      }

      headerAnimations(content: ElementRef<HTMLElement>): void {
        let delay: number = this.config.getHeaderDelay();
        gsap.fromTo(content.nativeElement, {opacity: 0}, {opacity: 0.9, duration: 1.2, delay: delay});
        gsap.fromTo(content.nativeElement.children, {opacity: 0}, {opacity: 1, duration: 1.2, delay: delay + 0.2});
      }

      headerButtonsAnimationsMobile(content: ElementRef<HTMLElement>): void {
        gsap.fromTo(content.nativeElement.children, {opacity: 0}, {opacity: 0.9, duration: 1});
      }

      async delayExec(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
      }
}
