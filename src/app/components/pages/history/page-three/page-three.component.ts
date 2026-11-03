import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-history-page-three',
  templateUrl: './page-three.component.html',
  styleUrls: ['./page-three.component.scss']
})
export class PageThreeComponent implements OnInit {
  pagePos: number = 2;
  @Input() observeStart: boolean = true;
  @Output() onPage: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }
    // the element that you are observing (just add #yourElement in the template) for this  query to work
    @ViewChild('topic3') yourElement: ElementRef;

    ngAfterViewInit() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // run your animation code here
                        if(this.observeStart) 
                            this.onPage.emit(this.pagePos);
                        // observer.disconnect(); // disconnect if you want to stop observing else it will rerun every time its back in view. Just make sure you disconnect in ngOnDestroy instead
                    }
                });
            },
            // Fires when the page crosses the middle of the viewport, whatever its height.
            { rootMargin: '-50% 0px -50% 0px' }
        );
        observer.observe(this.yourElement.nativeElement);
    }
}
