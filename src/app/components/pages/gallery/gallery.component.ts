
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { GalleryService } from 'src/app/shared/services/gallery.service';
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
  isAnimationAllowed: boolean = true;

  constructor(galleryService: GalleryService, private animationService: AnimationService) {
    this.galleryService = galleryService; 
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.CheckResolutionForAnimation();
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
    this.animationService.galleryAnimationCompleted.subscribe(result => {
      this.isAnimationOngoing = false;
    });

    this.CheckResolutionForAnimation();
  }

  NextImage(state: string): void {
    if(!this.isAnimationOngoing) {
      this.galleryService.NextImage(state, this.isAnimationAllowed);
      this.isAnimationOngoing = this.isAnimationAllowed;
    }
  }

  TurnFullscreen(state: boolean): void {
    if(!this.isAnimationOngoing) {
      this.galleryService.FullScreen(true);
    }
  }

  CheckResolutionForAnimation(): void {
    if(window.innerWidth < 1000)
      this.isAnimationAllowed = false;
    else 
      this.isAnimationAllowed = true;
  }
}
