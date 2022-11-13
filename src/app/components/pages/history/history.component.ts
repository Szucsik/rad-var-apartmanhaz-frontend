import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  topics: Array<number> = [ 1, 1, 1, 1, 1, 1, 1]
  focus: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

}
