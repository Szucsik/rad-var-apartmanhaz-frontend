
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AnimationService } from 'src/app/shared/services/animation.service';
import { GalleryService } from 'src/app/shared/services/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})

export class GalleryComponent implements OnInit {
  galleryService: GalleryService;

  constructor(galleryService: GalleryService, private animationService: AnimationService) {
    this.galleryService = galleryService; 
  }

  ngOnInit(): void {
  }

  NextImage(state: string): void {

  }

  TurnFullscreen(state: boolean): void {

  }
}
