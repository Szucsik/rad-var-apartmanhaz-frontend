import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {
  constructor() { }

  openLink(url: string): void {
    window.open(url, "_blank");
  }
}
