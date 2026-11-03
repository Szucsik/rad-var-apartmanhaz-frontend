import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-history-page-one',
  templateUrl: './page-one.component.html',
  styleUrls: ['./page-one.component.scss']
})
export class PageOneComponent implements OnInit {
  pagePos: number = 0;
  @Input() observeStart: boolean = true;
  @Output() onPage: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }
    // the element that you are observing (just add #yourElement in the template) for this  query to work
    @ViewChild('topic1') yourElement: ElementRef;

    ngAfterViewInit() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // run your animation code here
                        if(this.observeStart)
                            this.onPage.emit(this.pagePos);
                    }
                });
            },
            // Fires when the page crosses the middle of the viewport, whatever its height.
            { rootMargin: '-50% 0px -50% 0px' }
        );
        observer.observe(this.yourElement.nativeElement);
    }
}
