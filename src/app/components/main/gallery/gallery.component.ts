import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Galleria } from 'primeng/galleria';
import { PhotoService } from 'src/app/shared/services/galleryPhoto.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  images: any[];

  showThumbnails: boolean;

  fullscreen: boolean = false;

  activeIndex: number = 0;

  onFullScreenListener: any;

  @ViewChild('galleria') galleria: Galleria;


  constructor(private photoService: PhotoService) { }

  responsiveOptions:any[] = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];
  ngOnInit() {
      this.photoService.getImages().then(images => this.images = images);
      this.bindDocumentListeners();
  }

  onThumbnailButtonClick() {
      this.showThumbnails = !this.showThumbnails;
  }

  toggleFullScreen() {
      if (this.fullscreen) {
          this.closePreviewFullScreen();
      }
      else {
          this.openPreviewFullScreen();
      }
  }

  openPreviewFullScreen() {
      let elem = this.galleria.element.nativeElement.querySelector(".p-galleria");
      if (elem.requestFullscreen) {
          elem.requestFullscreen();
      }
      else if (elem['mozRequestFullScreen']) { /* Firefox */
          elem['mozRequestFullScreen']();
      }
      else if (elem['webkitRequestFullscreen']) { /* Chrome, Safari & Opera */
          elem['webkitRequestFullscreen']();
      }
      else if (elem['msRequestFullscreen']) { /* IE/Edge */
          elem['msRequestFullscreen']();
      }
  }

  onFullScreenChange() {
      this.fullscreen = !this.fullscreen;
  }

  closePreviewFullScreen() {
      if (document.exitFullscreen) {
          document.exitFullscreen();
      }
      else if (document['mozCancelFullScreen']) {
          document['mozCancelFullScreen']();
      }
      else if (document['webkitExitFullscreen']) {
          document['webkitExitFullscreen']();
      }
      else if (document['msExitFullscreen']) {
          document['msExitFullscreen']();
      }
  }

  bindDocumentListeners() {
      this.onFullScreenListener = this.onFullScreenChange.bind(this);
      document.addEventListener("fullscreenchange", this.onFullScreenListener);
      document.addEventListener("mozfullscreenchange", this.onFullScreenListener);
      document.addEventListener("webkitfullscreenchange", this.onFullScreenListener);
      document.addEventListener("msfullscreenchange", this.onFullScreenListener);
  }

  unbindDocumentListeners() {
      document.removeEventListener("fullscreenchange", this.onFullScreenListener);
      document.removeEventListener("mozfullscreenchange", this.onFullScreenListener);
      document.removeEventListener("webkitfullscreenchange", this.onFullScreenListener);
      document.removeEventListener("msfullscreenchange", this.onFullScreenListener);
      this.onFullScreenListener = null;
  }

  ngOnDestroy() {
      this.unbindDocumentListeners();
  }

  galleriaClass() {
      return `custom-galleria ${this.fullscreen ? 'fullscreen' : ''}`;
  }

  fullScreenIcon() {
      return `pi ${this.fullscreen ? 'pi-window-minimize' : 'pi-window-maximize'}`;
  }
}
