import { ElementRef, EventEmitter, Injectable } from "@angular/core";
import { Configuration } from "../config";
import { gsap } from 'gsap';
import { GalleryImageComponents } from "../types/gallery.type";
import { Position } from "../types/position.type";


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
        gsap.fromTo(content.nativeElement.childNodes, {opacity: 0}, {opacity: 1, duration: 1.2, delay: delay + 0.2});
      }

      async galleryScrollAnimations(imgs: GalleryImageComponents, directon: string) {
        let duration: number = this.config.getImageStartScrollDuration();
        // get original positions

        let previousHiddenPos: Position = {x: imgs.previousHidden.nativeElement.offsetWidth,y: imgs.previousHidden.nativeElement.offsetTop};
        let previousPos: Position = {x: imgs.previousVisible.nativeElement.offsetLeft,y: imgs.previousVisible.nativeElement.offsetTop};
        let mainPos: Position = {x: imgs.mainVisible.nativeElement.offsetLeft,y: imgs.mainVisible.nativeElement.offsetTop};
        let nextPos: Position = {x: imgs.nextVisible.nativeElement.offsetLeft,y: imgs.nextVisible.nativeElement.offsetTop};
        let nextHiddenPos: Position = {x: imgs.nextHidden.nativeElement.offsetLeft,y: imgs.nextHidden.nativeElement.offsetTop};

        //  get original sizes
        let mainSize: Position = {x: imgs.mainVisible.nativeElement.clientWidth,y: imgs.mainVisible.nativeElement.clientHeight};
        let subSize: Position = {x: imgs.nextVisible.nativeElement.clientWidth,y: imgs.nextVisible.nativeElement.clientHeight};
        
        switch(directon) {
          case 'right': {
            // Correction for main (due css transform. look at css) = future width (after transform / 2)
            let mainCorrection = subSize.x / 2;
            // subsize.x/2 -> to make the little sized center; mainsize-subsize / 2 -> due to grow only in the left side
            let nextCorrection = - subSize.x / 2 + (mainSize.x - subSize.x) / 2;

            let previousRatio = previousPos.x / window.innerWidth;
            let nextRatio = (nextPos.x + subSize.x) / window.innerWidth;

            let hiddenNextStartX: number = window.innerWidth +  nextHiddenPos.x;
            let newPrevPos: Position  = {
              x: - previousPos.x - subSize.x,
              y: 0
            };

            let newMainPos: Position  = {
              x: window.innerWidth * previousRatio - mainPos.x + mainCorrection,
              y: previousPos.y - mainPos.y
            };

            let newNextPos: Position  = {
              x: window.innerWidth / 2 - nextPos.x + nextCorrection,
              y: mainPos.y - nextPos.y
            };

            let newNextHiddenPos: Position  = {
              x: window.innerWidth * nextRatio - subSize.x, 
              y: nextPos.y - nextHiddenPos.y
            };

            //animation 
            let tweenPrevVis = gsap.fromTo(imgs.previousVisible.nativeElement, {}, {width: 0, height: 0, x: newPrevPos.x, duration: duration});
            let tweenMainVis = gsap.fromTo(imgs.mainVisible.nativeElement, {}, {width: subSize.x, height: subSize.y, x: newMainPos.x, y: newMainPos.y, duration: duration});
            let tweenNextVis = gsap.fromTo(imgs.nextVisible.nativeElement, {}, {width: mainSize.x, height: mainSize.y, x: newNextPos.x, y: newNextPos.y, duration: duration});
            let tweenNextHid = gsap.fromTo(imgs.nextHidden.nativeElement, {x: hiddenNextStartX, width: subSize.x, height: subSize.y}, {x: newNextHiddenPos.x, y: newNextHiddenPos.y, duration: duration});

            // after animation
            await this.delayExec(duration * 1000);

            tweenPrevVis.progress(0).pause();
            tweenMainVis.progress(0).pause();
            tweenNextVis.progress(0).pause();
            tweenNextHid.progress(0).pause();

            this.galleryAnimationCompleted.emit(true);
            break;
          }
          case 'left': {
            let newPrevPos: Position  = {
              x: mainPos.x - previousPos.x  + subSize.x - mainSize.x - subSize.x/3,
              y: mainPos.y - previousPos.y 
            };

            let newMainPos: Position  = {
              x: nextPos.x - mainPos.x + subSize.x - mainSize.x - subSize.x/2,
              y: nextPos.y - mainPos.y
            };

            let newNextPos: Position  = {
              x: subSize.x + subSize.x/2,
              // x: - nextPos.x + (mainSize.x - subSize.x),
              y: 0
            };

            let newPrevHiddenPos: Position  = {
              x: previousPos.x,
              y: nextPos.y - nextHiddenPos.y
            };

            let startX: number = - subSize.x;

            //animation 
            let tweenNextVis = gsap.fromTo(imgs.nextVisible.nativeElement, {}, {x: newNextPos.x, duration: duration});
            let tweenMainVis = gsap.fromTo(imgs.mainVisible.nativeElement, {}, {width: subSize.x, height: subSize.y, x: newMainPos.x, y: newMainPos.y, duration: duration});
            let tweenPrevVis = gsap.fromTo(imgs.previousVisible.nativeElement, {}, {width: mainSize.x, height: mainSize.y,x: newPrevPos.x, y: newPrevPos.y, duration: duration});
            let tweenPrevHid = gsap.fromTo(imgs.previousHidden.nativeElement, {x: startX}, {width: subSize.x, height: subSize.y, y: newPrevHiddenPos.y, x: newPrevHiddenPos.x, duration: duration});

            // after animation
            await this.delayExec(duration * 1000);

            tweenNextVis.progress(0).pause();
            tweenMainVis.progress(0).pause();
            tweenPrevVis.progress(0).pause();
            tweenPrevHid.progress(0).pause();

            this.galleryAnimationCompleted.emit(false);
            break;
          }
        }
      }

      async delayExec(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
      }
}
