import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class PreloadService {
    public loadComplated: EventEmitter<boolean> = new EventEmitter<boolean>();
    public loadPrioComplated: EventEmitter<boolean> = new EventEmitter<boolean>();
    private imageList: Array<String> = ["wallpaperflare.com_wallpaper2.jpg", "bg.overlay.png", "cliff.png", "couple2.png", "couple.png",
                                        "flag-en.png", "flag-hu.png", "flag-gr.png", "flag-pl.png", "logo-castle-white.png", "quote-end.png",
                                        "quote-end.png", "transition.png"];
    private prioImageList: Array<String> = ["logo-castle-white.png"];
    private loadedCounter: number = 0;
    private loadedPrioCounter: number = 0;

    public preloadImages(): void {
        this.imageList.forEach(image => {
            const base_image = new Image();
            base_image.src = "/assets/" + image;
            base_image.onload = this.countLoaded;
        });
    }

    public preLoadPrioImages(): void {
        this.prioImageList.forEach(image => {
            const base_image = new Image();
            base_image.src = "/assets/" + image;
            base_image.onload = this.countPrioLoaded;
        });
    }

    private countLoaded(): void {
        this.loadedCounter++;
        if(this.loadedCounter == this.imageList.length) {
            this.loadComplated.emit(true);
        }
    }

    private countPrioLoaded(): void {
        this.loadedCounter++;
        if(this.loadedCounter == this.imageList.length) {
            this.loadPrioComplated.emit(true);
        }
    }
}
