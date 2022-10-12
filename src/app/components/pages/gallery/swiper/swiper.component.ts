import { Component, ViewEncapsulation, ViewChild, OnInit } from "@angular/core";
import { GalleryService } from "src/app/shared/services/gallery.service";
import { SwiperComponent } from "swiper/angular";
// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper";

// install Swiper modules
SwiperCore.use([Pagination]);


@Component({
  selector: 'gallery-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GallerySwiperComponent implements OnInit{
  @ViewChild('swiperGallery', { static: false }) gallery: SwiperComponent;
  images: String[];
  constructor(private galleryService: GalleryService) {  }

  ngOnInit(): void {
    this.images =  this.galleryService.GetAllPrevievImageSources();
  }

  public NextImage(): void {
    this.gallery.swiperRef.slideNext();
  }

  public PrevImage(): void {
    this.gallery.swiperRef.slidePrev();
  }
}
