import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class PreloadService {
    public loadComplated: EventEmitter<boolean> = new EventEmitter<boolean>();
    public loadStartComplated: EventEmitter<boolean> = new EventEmitter<boolean>();
    private imageList: Array<String> = ["wallpaperflare.com_wallpaper2.jpg", "bg-overlay.png", "cliff.png", "couple2.png",
                                        "flag-en.png", "flag-hu.png", "flag-gr.png", "flag-pl.png", "logo-castle-white.png", "quote-end.png", "transition.png"];

    private startImageList: Array<String> = ["logo-castle-white.png"];
    private loadedCounter: number = 0;
    private startLoadedCounter: number = 0;

    public preloadImages(): void {
        this.imageList.forEach(image => {
            const base_image = new Image();
            base_image.src = "/assets/" + image;
            base_image.onload = ()=> {
                this.loadedCounter++;
                if(this.loadedCounter == this.imageList.length) {
                    this.loadComplated.emit(true);
                }
            }
        });
    }

    public preloadStartImages(): void {
        this.startImageList.forEach(image => {
            const base_image = new Image();
            base_image.src = "/assets/" + image;
            base_image.onload = ()=> {
                this.startLoadedCounter++;
                if(this.startLoadedCounter == this.startImageList.length) {
                    this.loadStartComplated.emit(true);
                }
            }
        });
    }
}
