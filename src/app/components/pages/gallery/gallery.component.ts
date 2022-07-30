
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration } from 'src/app/shared/config';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  @ViewChild('gallery', { static: true }) gallery: ElementRef<HTMLImageElement>;

  constructor(private animationService: AnimationService, private scrollAnimationService: ScrollAnimationService, private config: Configuration) { }


  readonly imageSources: Array<string> = this.config.getPhotoList();

  currentImageID: number = 0;
  currentImageSource: string = this.imageSources[this.currentImageID];

  ngOnInit(): void {
    this.scrollAnimationService.galleryScrollTrigger();
  }
  
  scroll(direction: string) {
    if(direction == 'right') {
      if(this.currentImageID < this.imageSources.length - 1) {
        this.currentImageID++;
        this.animationService.galleryScrollAnimations(this.gallery, this.imageSources[this.currentImageID]);
      }
    } else if (direction == 'left') {
      if(this.currentImageID > 0) {
        this.currentImageID--;
        this.animationService.galleryScrollAnimations(this.gallery, this.imageSources[this.currentImageID]);
      }
    } 
  }
}
