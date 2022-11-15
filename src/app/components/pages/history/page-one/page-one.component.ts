import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-history-page-one',
  templateUrl: './page-one.component.html',
  styleUrls: ['./page-one.component.scss']
})
export class PageOneComponent implements OnInit {
  pagePos: number = 0;
  @Output() onPage: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }
    // the element that you are observing (just add #yourElement in the template) for this  query to work
    @ViewChild('topic1') yourElement: ElementRef;

    ngAfterViewInit() {
        const threshold = 0.5; // how much % of the element is in view
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // run your animation code here
                        this.onPage.emit(this.pagePos);
                    }
                });
            },
            { threshold }
        );
        observer.observe(this.yourElement.nativeElement);
    }
}
