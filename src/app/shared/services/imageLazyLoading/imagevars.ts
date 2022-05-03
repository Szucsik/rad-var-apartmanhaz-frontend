import { EventEmitter } from '@angular/core';
export class ImageVars {
    public static loaded: EventEmitter<boolean> = new EventEmitter<boolean>();
    public static divs: Array<HTMLDivElement> = new Array<HTMLDivElement>();
    public static images: Array<HTMLImageElement> = new Array<HTMLImageElement>();
    public static loadedDivs: number = 0;
}