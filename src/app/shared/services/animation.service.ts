import { ElementRef, EventEmitter, Injectable } from "@angular/core";
import { Configuration } from "../config";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
        let animationY = 50;
    
        let X = screenWidth / 2 - 300;
        let Y = screenHeight / 2 - 200;
    
        let delay = 1.2;
    
        gsap.fromTo(titleTextFirst.nativeElement, {opacity: 0, y: Y + animationY, x: X + animationX}, {opacity: 1, duration: 1, ease: 'back', y: Y, x: X + animationX})
        gsap.fromTo(titleImg.nativeElement, {opacity: 0, y: Y - animationY, x: X + animationX}, {opacity: 1, duration: 1, ease: 'back', y: Y, x: X + animationX, delay: delay})
    
        delay++;
        gsap.fromTo(titleTextFirst.nativeElement, {x: X + animationX}, {duration: 1, ease: 'back',x: X, delay: delay})
        gsap.fromTo(titleImg.nativeElement, {x: X + animationX}, {duration: 1, ease: 'back',x: X, delay: delay})
        gsap.fromTo(titleTextLast.nativeElement, {opacity: 0, y: Y, x: X - animationX}, {opacity: 1, duration: 1, ease: 'back', y: Y, x: X, delay: delay});
      }

      homeScrollTrigger(): void {
        const tl = gsap.timeline({
            scrollTrigger: {
              trigger: "#hero",
              start: "top top",
              end: "bottom top",
              scrub: true
            }
          });
          
          gsap.utils.toArray<HTMLElement>(".parallax").forEach(layer => {
            let depth = Number(layer.dataset.depth);
            let movement = -(layer.offsetHeight * depth)
            tl.to(layer, {y: movement, ease: "none"}, 0)
          });
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
}