import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class Configuration {
    public getContentShowDelay: number = 6;
}