import { Component, ElementRef, ViewChild } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  @ViewChild('gallery', { static: true }) gallery: ElementRef<HTMLImageElement>;
  readonly imagesDirectory: string = 'assets/photos/';
  readonly imageSources: string[] = ['image-1.png','image-2.png','image-3.png','image-4.png','image-5.png','image-6.png','image-7.png','image-9.png'];

  currentImageID: number = 0;
  currentImageSource: string = this.imagesDirectory.concat(this.imageSources[this.currentImageID]);

  constructor(private animationService: AnimationService) { }

  scroll(direction: string) {
    if(direction == 'right') {
      if(this.currentImageID < this.imageSources.length - 1) {
        this.currentImageID++;
        this.animationService.galleryScrollAnimations(this.gallery, this.imagesDirectory.concat(this.imageSources[this.currentImageID]));
      }
    } else if (direction == 'left') {
      if(this.currentImageID > 0) {
        this.currentImageID--;
        this.animationService.galleryScrollAnimations(this.gallery, this.imagesDirectory.concat(this.imageSources[this.currentImageID]));
      }
    } 
  }
}
