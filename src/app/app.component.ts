import { Component, OnInit } from "@angular/core";
import { Configuration } from "./shared/config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  config: Configuration;
  enableLoadingContainer: boolean = true;
  constructor(config: Configuration) { this.config = config;}

  ngOnInit(): void {
    this.config.setLoadingContentNeeded();
    this.setLoadingContainer();
  }

  async setLoadingContainer() {
      await delayExec(this.config.getContentDelay() * 1000);
      this.config.setStartAnimationsCompleted();
      this.enableLoadingContainer = !this.config.getStartAnimationsCompleted();
  }
}

function delayExec(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}