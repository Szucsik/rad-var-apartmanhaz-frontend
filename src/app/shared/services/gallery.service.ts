import { EventEmitter, Injectable } from "@angular/core";
import { Configuration } from "../config";
import { GalleryImageDescriptions } from "../texts/hun/gallery.image.descriptions";
import { AnimationService } from "./animation.service";

@Injectable({
    providedIn: 'root',
})

export class GalleryService{
    fullscreenEvent: EventEmitter<boolean> = new EventEmitter();

    private currentImageID: number = 0;
    private readonly imageSources: Array<string> = this.config.getPhotoPreviewList();
    private readonly HDImageSources: Array<string> = this.config.getPhotoList();
    private fullscreenState: boolean = false;

    constructor(private animationService: AnimationService, private config: Configuration, private galleryImageDescriptions: GalleryImageDescriptions) {       
      this.animationService.galleryAnimationCompleted.subscribe(increaseOrDecrease => {
        this.ChangeCurrentImageID(increaseOrDecrease);
      });
    }

    FullScreen(state: boolean): void {
      this.fullscreenState = state;
      this.fullscreenEvent.emit(state);
    }

    // Getters

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

    GetCurrentHDImageSource(): string {
      return this.HDImageSources[this.currentImageID];
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

    GetAllPrevievImageSources(): Array<string> {
      return this.imageSources;
    }

    getPhotoDescriptions(): Array<string> {
      return this.galleryImageDescriptions.text;
    }

    // private

    private ChangeCurrentImageID(increaseOrDecrease: boolean): void {
      if(increaseOrDecrease) {
        this.IncreaseCurrentImageID();
      } else {
        this.DecreaseCurrentImageID();
      }
    }

    // Setters

    IncreaseCurrentImageID(): void {
      if(this.currentImageID + 1 == this.imageSources.length) {
        this.currentImageID = 0;
      } else {
        this.currentImageID++;
      }
    }

    SetCurrentImageID(id: number): void {
      this.currentImageID = id;
    }

    DecreaseCurrentImageID(): void {
      if(this.currentImageID - 1 < 0) {
        this.currentImageID = this.imageSources.length - 1;
      } else {
        this.currentImageID--;
      }
    }
}
