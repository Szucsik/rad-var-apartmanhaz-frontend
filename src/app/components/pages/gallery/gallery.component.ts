
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration } from 'src/app/shared/config';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';
import { GalleryImageComponents } from 'src/app/shared/types/gallery.type';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  @ViewChild('galleryPrevHid', { static: true }) galleryImagePreviousHidden: ElementRef<HTMLImageElement>;
  @ViewChild('galleryPrev', { static: true }) galleryImagePrevious: ElementRef<HTMLImageElement>;
  @ViewChild('galleryMain', { static: true }) galleryImageMain: ElementRef<HTMLImageElement>;
  @ViewChild('galleryNext', { static: true }) galleryImageNext: ElementRef<HTMLImageElement>;
  @ViewChild('galleryNextHid', { static: true }) galleryImageNextHidden: ElementRef<HTMLImageElement>;

  galleryService: GalleryService;
  isAnimationOngoing: boolean = false;
  constructor(galleryService: GalleryService, private scrollAnimationService: ScrollAnimationService, private animationService: AnimationService) {
    this.galleryService = galleryService; 
  }

  ngOnInit(): void {
    let galleryImageComponents: GalleryImageComponents = {
      mainVisible: this.galleryImageMain,
      nextHidden: this.galleryImageNextHidden,
      nextVisible: this.galleryImageNext,
      previousHidden: this.galleryImagePreviousHidden,
      previousVisible: this.galleryImagePrevious
    }

    this.galleryService.RegisterGalleryComponents(galleryImageComponents);
    this.scrollAnimationService.galleryScrollTrigger();

    this.animationService.galleryAnimationCompleted.subscribe(result => {
      this.isAnimationOngoing = false;
    });
  }

  NextImage(state: string): void {
    if(!this.isAnimationOngoing) {
      this.galleryService.NextImage(state);
      this.isAnimationOngoing = true;
    }
  }

  TurnFullscreen(state: boolean): void {
    if(!this.isAnimationOngoing) {
      this.galleryService.FullScreen(true);
    }
  }
}
