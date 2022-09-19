import { ElementRef } from "@angular/core"

export type GalleryImageComponents = {
    previousHidden: ElementRef<HTMLImageElement>,
    previousVisible: ElementRef<HTMLImageElement>,
    mainVisible: ElementRef<HTMLImageElement>,
    nextVisible: ElementRef<HTMLImageElement>,
    nextHidden: ElementRef<HTMLImageElement>,
}