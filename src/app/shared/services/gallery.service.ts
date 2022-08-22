import { ElementRef, EventEmitter, Injectable } from "@angular/core";
import { Configuration } from "../config";
import { AnimationService } from "./animation.service";

@Injectable({
    providedIn: 'root',
})

export class GalleryService {
    fullscreenEvent: EventEmitter<boolean> = new EventEmitter();

    private currentImageID: number = 0;
    private readonly imageSources: Array<string> = this.config.getPhotoList();
    private galleryComponent: ElementRef<HTMLImageElement>;
    private fullscreenState: boolean = false;

    constructor(private animationService: AnimationService, private config: Configuration) { }

    RegisterGalleryComponent(gallery: ElementRef<HTMLImageElement>): void {
        this.galleryComponent = gallery;
    }

    NextImage(direction: string): void {
        if(direction == 'right') {
          if(this.currentImageID < this.imageSources.length - 1) {
            this.currentImageID++;
            this.animationService.galleryScrollAnimations(this.galleryComponent, this.imageSources[this.currentImageID]);
          }
        } else if (direction == 'left') {
          if(this.currentImageID > 0) {
            this.currentImageID--;
            this.animationService.galleryScrollAnimations(this.galleryComponent, this.imageSources[this.currentImageID]);
          }
        } 
      }

      FullScreen(state: boolean): void {
        this.fullscreenState = state;
        this.fullscreenEvent.emit(state);
      }

      GetCurrentImageID(): number {
        return this.currentImageID;
      }

      GetImagesNumber(): number {
        return this.imageSources.length;
      }

      GetCurrentImageSource(): string {
        return this.imageSources[this.currentImageID];
      }

      GetFullScreenState(): Boolean {
        return this.fullscreenState;
      }
}
