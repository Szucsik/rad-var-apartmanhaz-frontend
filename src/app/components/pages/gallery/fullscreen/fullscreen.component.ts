import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { I18nService } from 'src/app/shared/services/i18n.service';
import { GalleryService } from 'src/app/shared/services/gallery.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.css']
})


export class FullscreenComponent {
  protected readonly t = inject(I18nService).t;
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: Event) {
    this.galleryService.FullScreen(false);
  }

  galleryService: GalleryService;

  constructor(galleryService: GalleryService) {
    this.galleryService = galleryService; 
  }
}