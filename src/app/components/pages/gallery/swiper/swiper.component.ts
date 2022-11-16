import { Component, ViewEncapsulation, ViewChild, OnInit } from "@angular/core";
import { GalleryService } from "src/app/shared/services/gallery.service";
import { SwiperComponent } from "swiper/angular";
// import Swiper core and required modules
import SwiperCore, { Autoplay, EffectCards } from "swiper";

// install Swiper modules
SwiperCore.use([Autoplay, EffectCards]);


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
    this.AdjustSwiperSize();
  }

  private AdjustSwiperSize(): void {
    // Swiper cant calculate percentage size when you use it in the CSS, thats why we need this method.
    
  }

  public NextImage(): void {
    this.gallery.swiperRef.slideNext();
  }

  public PrevImage(): void {
    this.gallery.swiperRef.slidePrev();
  }

  onSlideChange() {
    this.galleryService.SetCurrentImageID(this.gallery.swiperRef.snapIndex);
  }
}
