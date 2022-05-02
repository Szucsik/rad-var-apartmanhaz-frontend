import { BgInfo } from "../../bgInfo.type"


export class DivBgs {
    public static HomeBg: BgInfo = {id: "HomeBg", backgroundImg: "/assets/wallpaperflare.com_wallpaper2.jpg"}
    public static HomeLayer2: BgInfo = {id: "HomeLayer2", backgroundImg: "/assets/cliff.png"}
    public static HomeLayer3: BgInfo = {id: "HomeLayer3", backgroundImg: "/assets/couple2.png"}
    public static HomeLayer4: BgInfo = {id: "HomeLayer4", backgroundImg: "/assets/transition.png"}
    public static HomeOverlay: BgInfo = {id: "HomeOverlay", backgroundImg: "/assets/bg-overlay.png"}

    public static FullCollection: Array<BgInfo> = [
        this.HomeBg,
        this.HomeLayer2,
        this.HomeLayer3,
        this.HomeLayer4,
        this.HomeOverlay
    ]
}