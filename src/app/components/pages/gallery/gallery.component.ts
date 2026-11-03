
import { Component, OnInit, ViewChild } from '@angular/core';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { GallerySwiperComponent } from './swiper/swiper.component';

@Component({
  standalone: false,
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})

export class GalleryComponent implements OnInit {
  @ViewChild('swiper', { static: false }) swiper: GallerySwiperComponent;
  galleryService: GalleryService;

  constructor(galleryService: GalleryService) {
    this.galleryService = galleryService; 
  }

  ngOnInit(): void {
  }

  TurnFullscreen(state: boolean): void {
  }
}
