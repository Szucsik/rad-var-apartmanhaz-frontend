import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration } from 'src/app/shared/config';
import { gsap } from 'gsap';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('content', { static: true }) content: ElementRef<HTMLElement>;
  config: Configuration;

  constructor(config: Configuration) { this.config = config;}

  ngOnInit(): void {
    this.showContent(this.config.getContentShowDelay);
  }

  showContent(delay: number): void {
    gsap.fromTo(this.content.nativeElement, {opacity: 0}, {opacity: 1, duration: 1, delay: delay});
  }
}
