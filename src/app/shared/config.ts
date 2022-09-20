import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root',
})

export class Configuration {
    private loadedSessionName: string = "isLoaded";
    private sessionContent: string = "testval";
    private loadingContentNeeded: boolean;
    private startAnimationsCompelted: boolean = true;
    private baseContentDelay: number = 5.6;
    private baseHeaderDelay: number = 4.6;
    private baseStartDelay: number = 3.2;
    private baseImageScrollDuration: number = 1;

    private photoList: Array<string> = ["assets/photos//2.jpeg", "assets/photos//2.jpeg", "assets/photos//3.jpeg", "assets/photos//4.jpeg", "assets/photos//5.jpeg", "assets/photos//6.jpeg", "assets/photos//8.jpeg",
    "assets/photos//11.jpeg", "assets/photos//12.jpeg", "assets/photos//13.jpeg", "assets/photos//14.jpeg", "assets/photos//16.jpeg", "assets/photos//17.jpeg", "assets/photos//18.jpeg", "assets/photos//19.jpeg",
    "assets/photos//21.jpeg", "assets/photos//22.jpeg", "assets/photos//23.jpeg", "assets/photos//24.jpeg", "assets/photos//25.jpeg", "assets/photos//26.jpeg", "assets/photos//27.jpeg",
    "assets/photos//31.jpeg", "assets/photos//32.jpeg" , "assets/photos//33.jpeg"];

    private photoPreviewList: Array<string> = ["assets/photos/preview/1.png", "assets/photos/preview/2.png", "assets/photos/preview/3.png", "assets/photos/preview/4.png", "assets/photos/preview/5.png", 
    "assets/photos/preview/6.png", "assets/photos/preview/7.png", "assets/photos/preview/8.png", "assets/photos/preview/9.png", "assets/photos/preview/10.png", "assets/photos/preview/11.png", "assets/photos/preview/12.png", 
    "assets/photos/preview/13.png", "assets/photos/preview/14.png", "assets/photos/preview/15.png", "assets/photos/preview/16.png", "assets/photos/preview/17.png", "assets/photos/preview/18.png", "assets/photos/preview/19.png", 
    "assets/photos/preview/20.png", "assets/photos/preview/21.png", "assets/photos/preview/22.png", "assets/photos/preview/23.png", "assets/photos/preview/25.png", "assets/photos/preview/25.png", ];

    public getHeaderDelay(): number {
        return this.getLoadingContentNeeded() ? this.baseHeaderDelay : 0;
    }

    public getContentDelay(): number {
        return this.getLoadingContentNeeded() ? this.baseContentDelay : this.baseContentDelay - this.baseHeaderDelay;
    }

    public getStartDelay(): number {
        return this.baseStartDelay;
    }

    public getImageStartScrollDuration(): number {
        return this.baseImageScrollDuration;
    }

    public getLoadingContentNeeded(): boolean {
        if (sessionStorage.getItem(this.loadedSessionName) == this.sessionContent) {
            return this.loadingContentNeeded;
        } else {
            sessionStorage.setItem(this.loadedSessionName, this.sessionContent);
            return this.loadingContentNeeded;
        }
    }

    public getStartAnimationsCompleted(): boolean {
        return this.startAnimationsCompelted;
    }

    public getPhotoList(): Array<string> {
        return this.photoList;
    }

    public getPhotoPreviewList(): Array<string> {
        return this.photoPreviewList;
    }


    // Setters
    public setStartComponentNeeded() {
        if (sessionStorage.getItem(this.loadedSessionName) == this.sessionContent) {
            this.loadingContentNeeded = false;
        } else {
            sessionStorage.setItem(this.loadedSessionName, this.sessionContent);
            this.loadingContentNeeded =  true;
        }
    }

    public setStartAnimationsCompleted() {
        this.startAnimationsCompelted = true;
    }
}

