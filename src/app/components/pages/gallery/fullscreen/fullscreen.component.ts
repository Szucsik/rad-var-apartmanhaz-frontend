import { Component, OnInit } from '@angular/core';
import { GalleryService } from 'src/app/shared/services/gallery.service';

@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.css']
})
export class FullscreenComponent implements OnInit {
  
  galleryService: GalleryService;
  constructor(galleryService: GalleryService) {
    this.galleryService = galleryService; 
  }

  ngOnInit(): void {
  }

}
