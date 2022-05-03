import { ImageVars } from './imagevars';
import { Injectable } from '@angular/core';
import { DivBgs } from './divBgs.collection';

@Injectable({
    providedIn: 'root',
})
export class ImageLazyLoadingService {    
    public registerDiv(div: HTMLDivElement): void {
        if(div.id != '') {
            if(DivBgs.FullCollection.find(item => item.id == div.id)) {
                ImageVars.divs.push(div);
            }
        }
    }

    public preloadAll(): void {
        ImageVars.divs.forEach(div => {
            const base_image = new Image();
            base_image.src = DivBgs.FullCollection.filter(item => item.id == div.id)[0].backgroundImg;
            base_image.onload = function() {
                ImageVars.loadedDivs++;
                ImageVars.images.push(base_image);
                if(ImageVars.loadedDivs == ImageVars.divs.length) {
                    ImageVars.loaded.emit(true);
                }
            }
        });
    }

    public loadAllImages(): void {
        for(let i = 0; i < ImageVars.loadedDivs; i++) {
            ImageVars.divs[i].style.backgroundImage = "url(" + ImageVars.images[i].src + ")";
        }
    }
}