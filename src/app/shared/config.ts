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

    // Getters
    public getHeaderDelay(): number {
        return this.getLoadingContentNeeded() ? this.baseHeaderDelay : 0;
    }

    public getContentDelay(): number {
        return this.getLoadingContentNeeded() ? this.baseContentDelay : this.baseContentDelay - this.baseHeaderDelay;
    }

    public getStartDelay(): number {
        return this.baseStartDelay;
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

    // Setters
    public setLoadingContentNeeded() {
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

