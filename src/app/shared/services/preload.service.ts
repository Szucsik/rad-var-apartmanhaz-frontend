import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class PreloadService {
    public loadComplated: EventEmitter<boolean> = new EventEmitter<boolean>();
    private static loadedImages: Array<HTMLImageElement> = new Array<HTMLImageElement>();
    private imageList: Array<String> = ["site-images/wallpaperflare.com_wallpaper2.jpg", "site-images/bg-overlay.png", "site-images/cliff.png", "site-images/couple2.png",
                                        "site-images/country-flags/flag-en.png", "site-images/country-flags/flag-hu.png", "site-images/country-flags/flag-gr.png", "site-images/country-flags/flag-pl.png",
                                        "site-images/logo-castle-white.png", "site-images/quote-end.png", "site-images/transition.png"];
    private photoList: Array<String> = ["photos/image-1.png", "photos/image-2.png", "photos/image-3.png", "photos/image-4.png", "photos/image-5.png", "photos/image-6.png", 
                                        "photos/image-7.png", "photos/image-9.png" ];
    private loadedCounter: number = 0;

    public preloadImages(): void {
        const allImages: Array<String> = this.imageList.concat(this.photoList);
        allImages.forEach(image => {
            PreloadService.loadedImages.push(new Image());
            let index = PreloadService.loadedImages.length - 1;

            PreloadService.loadedImages[index].src = "/assets/" + image;
            PreloadService.loadedImages[index].onload = ()=> {
                this.loadedCounter++;
                if(this.loadedCounter == allImages.length) {
                    this.loadComplated.emit(true);
                }
            }
        });
    }
}
