import { Component, OnInit } from '@angular/core';
import { ScrollAnimationService } from 'src/app/shared/services/scrollAnimation.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  constructor(private scrollAnimationService: ScrollAnimationService) { }

  ngOnInit(): void {
    this.scrollAnimationService.contactsScrollTrigger();
  }

  openLink(url: string): void {
    window.open(url, "_blank");
  }
}
