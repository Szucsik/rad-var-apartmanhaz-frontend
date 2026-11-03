
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, inject } from '@angular/core';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { GalleryService } from 'src/app/shared/services/gallery.service';
import { GallerySwiperComponent } from './swiper/swiper.component';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})

export class GalleryComponent implements OnInit {
  protected readonly t = inject(I18nService).t;
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
