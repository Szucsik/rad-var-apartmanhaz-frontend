import { ElementRef, EventEmitter, Injectable, OnInit } from "@angular/core";
import { Configuration } from "../config";
import { AnimationService } from "./animation.service";
import { GalleryImageComponents } from "../types/gallery.type"
import { Subscription } from "rxjs";

@Injectable({
    providedIn: 'root',
})

export class GalleryService{
    fullscreenEvent: EventEmitter<boolean> = new EventEmitter();

    private currentImageID: number = 0;
    private readonly imageSources: Array<string> = this.config.getPhotoList();
    private galleryImageComponents: GalleryImageComponents;
    private fullscreenState: boolean = false;

    constructor(private animationService: AnimationService, private config: Configuration) {       
      this.animationService.galleryAnimationCompleted.subscribe(result => {
        if (result)
          this.currentImageID++;
      });
    }

    RegisterGalleryComponents(gallery: GalleryImageComponents): void {
      this.galleryImageComponents = gallery;
    }

    NextImage(direction: string): void {
          this.animationService.galleryScrollAnimations(this. galleryImageComponents, direction);
    }

    FullScreen(state: boolean): void {
      this.fullscreenState = state;
      this.fullscreenEvent.emit(state);
    }

    GetCurrentImageID(): number {
      return this.currentImageID;
    }

    GetNextImageID(id?: number): number {
      if(id == undefined)
        id = this.currentImageID;
      return id + 1 == this.imageSources.length ? 0 : id + 1;
    }

    GetPreviousImageID(id?: number): number {
      if(id == undefined)
        id = this.currentImageID;
      return id - 1 < 0 ? this.imageSources.length - 1 : id - 1;
    }

    GetImagesNumber(): number {
      return this.imageSources.length;
    }

    GetCurrentImageSource(): string {
      return this.imageSources[this.currentImageID];
    }

    GetNextImageSource(): string {
      return this.imageSources[this.GetNextImageID()];
    }

    GetNextHiddenImageSource(): string {
      return this.imageSources[this.GetNextImageID(this.GetNextImageID())];
    }

    GetPreviousImageSource(): string {
      return this.imageSources[this.GetPreviousImageID()];
    }

    GetPreviousHiddenImageSource(): string {
      return this.imageSources[this.GetPreviousImageID(this.GetPreviousImageID())];
    }

    GetFullScreenState(): Boolean {
      return this.fullscreenState;
    }
}
