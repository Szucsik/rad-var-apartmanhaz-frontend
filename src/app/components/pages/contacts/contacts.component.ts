import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {
  constructor() { }
  isMobileResolution: boolean = false;

  openLink(url: string): void {
    window.open(url, "_blank");
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth < 1000) {
      this.isMobileResolution = true;
    } else {
      this.isMobileResolution = false;
    }
  }
}
