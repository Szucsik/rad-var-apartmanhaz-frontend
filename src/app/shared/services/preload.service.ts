import { EventEmitter, Injectable } from "@angular/core";
import { Configuration } from "../config";

@Injectable({
    providedIn: 'root',
})

export class PreloadService {
    constructor(private config: Configuration) { }

    public loadComplated: EventEmitter<boolean> = new EventEmitter<boolean>();
    private static loadedImages: Array<HTMLImageElement> = new Array<HTMLImageElement>();
    private imageList: Array<string> = ["assets/site-images/wallpaperflare.com_wallpaper2.jpg", "assets/site-images/bg-overlay.png", "assets/site-images/cliff.png", "assets/site-images/couple2.png",
                                        "assets/site-images/country-flags/flag-en.png", "assets/site-images/country-flags/flag-hu.png", "assets/site-images/country-flags/flag-gr.png", "assets/site-images/country-flags/flag-pl.png",
                                        "assets/site-images/logo-castle-white.png", "assets/site-images/quote-end.png", "assets/site-images/transition.png", "assets/site-images/close-icon.png" ];

    private loadedCounter: number = 0;

    public preloadImages(): void {
        const allImages: Array<string> = this.imageList;
        allImages.forEach(image => {
            PreloadService.loadedImages.push(new Image());
            let index = PreloadService.loadedImages.length - 1;

            PreloadService.loadedImages[index].src = image;
            PreloadService.loadedImages[index].onload = ()=> {
                this.loadedCounter++;
                if(this.loadedCounter == allImages.length) {
                    this.loadComplated.emit(true);
                }
            }
        });
    }
}
