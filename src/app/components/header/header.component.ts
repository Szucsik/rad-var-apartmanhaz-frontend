import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;
  items: MenuItem[];
  constructor(private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {
    this.startingAnimation();
    this.primengConfig.ripple = true;

    this.items = [
      {
          icon: 'lang-hun-icon',
          command: () => {
              
          }
      },
      {
          icon: 'lang-eng-icon',
          command: () => {
              
          }
      },
      {
          icon: 'lang-ger-icon',
          command: () => {
              
          }
      }
  ];
  }

  startingAnimation(): void {
    gsap.fromTo(this.container.nativeElement.childNodes, {opacity: 0}, {opacity: 1, duration: 1.2, delay: 4.6});
  }
}


