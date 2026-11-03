import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css']
})
export class LogoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }
}
