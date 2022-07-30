import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root',
})

export class Configuration {
    private expectedUrl: string = "https://www.rad-var-apartmanhaz.hu/";
    private debugUrl: string = "localhost";
    private loadedSessionName: string = "isLoaded";
    private sessionContent: string = "testval";
    private loadingContentNeeded: boolean;
    private startAnimationsCompelted: boolean = true;
    private baseContentDelay: number = 5.6;
    private baseHeaderDelay: number = 4.6;
    private baseStartDelay: number = 3.2;
    private baseImageScrollDuration: number = 0.1;

    private photoList: Array<string> = ["assets/photos//1.jpeg", "assets/photos//2.jpeg", "assets/photos//3.jpeg", "assets/photos//4.jpeg", "assets/photos//5.jpeg", "assets/photos//6.jpeg", "assets/photos//7.jpeg", "assets/photos//8.jpeg",
    "assets/photos//11.jpeg", "assets/photos//12.jpeg", "assets/photos//13.jpeg", "assets/photos//14.jpeg", "assets/photos//15.jpeg", "assets/photos//16.jpeg", "assets/photos//17.jpeg", "assets/photos//18.jpeg", "assets/photos//19.jpeg",
    "assets/photos//21.jpeg", "assets/photos//22.jpeg", "assets/photos//23.jpeg", "assets/photos//24.jpeg", "assets/photos//25.jpeg", "assets/photos//26.jpeg", "assets/photos//27.jpeg",
    "assets/photos//31.jpeg", "assets/photos//32.jpeg"];

    // Getters
    public getExpectedUrl(): string {
        return this.expectedUrl;
    }

    public getDebugUrl(): string {
        return this.debugUrl;
    }

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

    // Setters
    public setStartComponentNeeded() {
        if (sessionStorage.getItem(this.loadedSessionName) == "this.sessionContent") {
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

