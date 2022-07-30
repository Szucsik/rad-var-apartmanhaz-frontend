import { ElementRef, EventEmitter, Injectable } from "@angular/core";
import { Configuration } from "../config";
import { gsap } from 'gsap';

@Injectable({
    providedIn: 'root',
})
export class AnimationService {
    contentLoaded: EventEmitter<boolean> = new EventEmitter();

    constructor(private config: Configuration) { }

    startAnimations(outerBox: ElementRef<HTMLDivElement>, innerBox: ElementRef<HTMLDivElement>): void {
        let delay: number = this.config.getStartDelay();
        let rollUpDuration: number = 1.5;

        gsap.fromTo(innerBox.nativeElement, {scale: 0.95 }, {scale: 1, duration: delay + rollUpDuration});
        gsap.fromTo(innerBox.nativeElement, {}, {yPercent: -100, delay: delay, duration: rollUpDuration});
        gsap.fromTo(outerBox.nativeElement, {}, {yPercent: -100, delay: delay + 0.1, duration: rollUpDuration});
    }

    logoAnimations(titleTextFirst: ElementRef<HTMLElement>, titleImg: ElementRef<HTMLElement>, titleTextLast: ElementRef<HTMLElement>): void {
        let screenWidth: number = window.innerWidth;
        let screenHeight: number = window.innerHeight;
    
        let animationX = 100;
    
        let X = screenWidth / 2 - 250;
        let Y = screenHeight / 2 - 250;
    
        let delay = 1;
    
        gsap.fromTo(titleImg.nativeElement, {opacity: 0, y: Y, x: X}, {opacity: 1, duration: 1})
        gsap.fromTo(titleTextFirst.nativeElement, {opacity: 0, y: Y - 15, x: X + animationX - 60}, {opacity: 1, duration: 1, delay: delay})
    
        delay += 0.5;
        gsap.fromTo(titleTextLast.nativeElement, {opacity: 0, y: Y, x: X - animationX}, {opacity: 1, duration: 1, ease: 'back', y: Y, x: X + animationX, delay: delay});

        delay++;
        gsap.fromTo(titleImg.nativeElement, {}, {duration: 1, opacity: 0, delay: delay})
        gsap.fromTo(titleTextFirst.nativeElement, {}, {duration: 1, opacity: 0, delay: delay})
        gsap.fromTo(titleTextLast.nativeElement, {}, {duration: 1, opacity: 0, delay: delay})
      }

      homeAnimations(content: ElementRef<HTMLElement>): void {
        let delay: number = this.config.getContentDelay();
        gsap.fromTo(content.nativeElement, {opacity: 0}, {opacity: 1, duration: 1, delay: delay, onComplete: this.config.setStartAnimationsCompleted});
      }

      headerAnimations(content: ElementRef<HTMLElement>): void {
        let delay: number = this.config.getHeaderDelay();
        gsap.fromTo(content.nativeElement, {opacity: 0}, {opacity: 0.9, duration: 1.2, delay: delay});
        gsap.fromTo(content.nativeElement.childNodes, {opacity: 0}, {opacity: 1, duration: 1.2, delay: delay + 0.2});
      }

      async galleryScrollAnimations(imgElement: ElementRef<HTMLImageElement>, newImgSource: string) {
        let duration: number = this.config.getImageStartScrollDuration();
        gsap.fromTo(imgElement.nativeElement, {opacity: 1}, {opacity: 0.0, duration: duration});
        gsap.fromTo(imgElement.nativeElement, {opacity: 0}, {opacity: 1, duration: duration, delay: duration, src: newImgSource});
        await this.delayExec(duration * 1000);
        imgElement.nativeElement.src = newImgSource;
      }

      async delayExec(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
      }
}
