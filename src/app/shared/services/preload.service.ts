import { EventEmitter, Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class PreloadService {
    public loadComplated: EventEmitter<boolean> = new EventEmitter<boolean>();
    private imageList: Array<String> = ["wallpaperflare.com_wallpaper2.jpg", "bg-overlay.png", "cliff.png", "couple2.png",
                                        "flag-en.png", "flag-hu.png", "flag-gr.png", "flag-pl.png", "logo-castle-white.png", "quote-end.png", "transition.png"];
    private photoList: Array<String> = ["photos/image-1.png", "photos/image-2.png", "photos/image-3.png", "photos/image-4.png", "photos/image-5.png", "photos/image-6.png", 
                                        "photos/image-7.png", "photos/image-9.png" ];
    private loadedCounter: number = 0;

    public preloadImages(): void {
        const allImages: Array<String> = this.imageList.concat(this.photoList);
        allImages.forEach(image => {
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
}
