
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { GallerySwiperComponent } from './swiper/swiper.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})

export class GalleryComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper: GallerySwiperComponent;
  galleryService: GalleryService;

  constructor(galleryService: GalleryService, private animationService: AnimationService) {
    this.galleryService = galleryService; 
  }

  ngOnInit(): void {
  }

  TurnFullscreen(state: boolean): void {

  }
}
