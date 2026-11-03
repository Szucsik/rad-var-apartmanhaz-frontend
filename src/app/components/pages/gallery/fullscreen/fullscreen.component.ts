import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { GalleryService } from 'src/app/shared/services/gallery.service';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.css']
})


export class FullscreenComponent {
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: Event) {
    this.galleryService.FullScreen(false);
  }

  galleryService: GalleryService;

  constructor(galleryService: GalleryService) {
    this.galleryService = galleryService; 
  }
}