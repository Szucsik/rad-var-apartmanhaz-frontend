import { ImageLazyLoadingService } from '../services/imageLazyLoading/imageLazyLoading.service';
import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: 'div'
})
export class DivDirective implements OnInit{
  constructor(private el: ElementRef, private lazyLoadingService: ImageLazyLoadingService) { }

  ngOnInit(): void {
      this.lazyLoadingService.registerDiv(this.el.nativeElement);
  }

}