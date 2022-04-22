import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { gsap } from 'gsap';
import { Configuration } from 'src/app/shared/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;
  @ViewChild('logo', { static: true }) logo: ElementRef<HTMLElement>;
  items: MenuItem[];
  contextName: string = 'header';
  config: Configuration;
  constructor(private primengConfig: PrimeNGConfig, config: Configuration) { this.config = config; }

  ngOnInit(): void {
    this.startingAnimation(this.config.getHeaderDelay());
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

  startingAnimation(delay: number): void {
    gsap.fromTo(this.container.nativeElement, {opacity: 0}, {opacity: 0.9, duration: 1.2, delay: delay});
    gsap.fromTo(this.container.nativeElement.childNodes, {opacity: 0}, {opacity: 1, duration: 1.2, delay: delay + 0.2});
  }
}


