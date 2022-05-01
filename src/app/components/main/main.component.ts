import { AfterViewChecked, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewChecked {
  @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngAfterViewChecked(): void {
    this.finishedLoading.emit(true);
  }

}
