import { ChangeDetectionStrategy, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { GalleryService } from "src/app/shared/services/gallery.service";
import Swiper from "swiper";
import { Autoplay, EffectCards } from "swiper/modules";

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'gallery-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GallerySwiperComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('swiperGallery', { static: true }) gallery: ElementRef<HTMLDivElement>;
  images: string[];
  protected readonly captions = () => this.galleryService.getPhotoDescriptions();
  private swiper: Swiper;

  constructor(private galleryService: GalleryService) {  }

  ngOnInit(): void {
    this.images = this.galleryService.GetAllPrevievImageSources();
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      return;
    }
    this.swiper = new Swiper(this.gallery.nativeElement, {
      modules: [Autoplay, EffectCards],
      autoHeight: true,
      effect: 'cards',
      grabCursor: true,
      autoplay: { delay: 1000, disableOnInteraction: true },
      on: {
        slideChange: () => this.onSlideChange()
      }
    });
  }

  ngOnDestroy(): void {
    this.swiper?.destroy();
  }

  public NextImage(): void {
    this.swiper.slideNext();
  }

  public PrevImage(): void {
    this.swiper.slidePrev();
  }

  onSlideChange() {
    this.galleryService.SetCurrentImageID(this.swiper.snapIndex);
  }
}
