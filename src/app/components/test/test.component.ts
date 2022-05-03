import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  @ViewChild('test', { static: true }) testDiv: ElementRef<HTMLDivElement>;
  dataUrl: string;
  constructor() { }

  ngOnInit(): void {
    const canvas = document.createElement("canvas");
    let context = canvas.getContext('2d');
    let ff = this.testDiv;
    const base_image = new Image();
    base_image.src = '/assets/flag-hu.png';
    base_image.onload = function(){
      context.drawImage(base_image, 50, 50);
      let dataUrl = canvas.toDataURL('image/jpg');
      ff.nativeElement.style.backgroundImage = 'url(' + dataUrl + ')';
      ff.nativeElement.style.width = '500px';
      ff.nativeElement.style.height = '500px';
    }
  }
  
  asd(): void {
    this.testDiv.nativeElement.style.backgroundImage = '';
  }

}
