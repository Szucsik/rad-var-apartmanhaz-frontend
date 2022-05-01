import { AfterViewChecked, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { AnimationService } from 'src/app/shared/services/animation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, AfterViewChecked {
  @Output() finishedLoading: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('container', { static: true }) container: ElementRef<HTMLElement>;

  items: MenuItem[];
  contextName: string = 'header';
  
  constructor(private primengConfig: PrimeNGConfig, private animationService: AnimationService) { }

  ngOnInit(): void {
    this.animationService.contentLoaded.subscribe(result => {
      this.animationService.headerAnimations(this.container);
    });

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

  ngAfterViewChecked(): void {
    this.finishedLoading.emit(true);
  }
}


