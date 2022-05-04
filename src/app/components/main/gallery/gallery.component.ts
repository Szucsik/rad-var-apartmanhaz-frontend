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

    constructor(private photoService: PhotoService) { }

    ngOnInit() {
        this.photoService.getImages().then(images => this.images = images)
    }
}
