import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  topics: Array<string> = [ "Bevezetés: kezdetek", "Híres lakók", "1944-től mostanáig"]
  focus: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  changeFocus(id: number): void {
    this.focus = id;
  }
}
