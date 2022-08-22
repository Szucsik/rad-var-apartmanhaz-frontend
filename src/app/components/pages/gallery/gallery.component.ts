
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration } from 'src/app/shared/config';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  @ViewChild('gallery', { static: true }) gallery: ElementRef<HTMLImageElement>;
  galleryService: GalleryService;
  constructor(galleryService: GalleryService, private scrollAnimationService: ScrollAnimationService, private config: Configuration) {
    this.galleryService = galleryService; 
  }

  ngOnInit(): void {
    this.galleryService.RegisterGalleryComponent(this.gallery);
    this.scrollAnimationService.galleryScrollTrigger();
  }
}
