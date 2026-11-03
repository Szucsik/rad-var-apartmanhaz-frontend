import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  topics: Array<string> = [ "Bevezetés: kezdetek", "Híres lakók", "1939-től mostanáig"]
  inactivePages: Array<boolean> = [ true, true, true]
  focus: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  changeFocus(id: number): void {
    this.focus = id;
    this.inactivePages[id] = false;
    for(let i = 0; i < this.inactivePages.length; i++) {
      if(i != id) {
        this.inactivePages[i] = true;
      }
    }
  }
}
