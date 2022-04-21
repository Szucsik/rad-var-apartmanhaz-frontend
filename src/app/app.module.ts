import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './components/start/start.component';
import { HeaderComponent } from './components/header/header.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';
import { LogoComponent } from './components/logo/logo.component';
import { PanelModule } from 'primeng/panel';
import { HomeComponent } from './components/main/home/home.component';
import { Configuration } from './shared/config';
import { MainComponent } from './components/main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    HeaderComponent,
    LogoComponent,
    HomeComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    RippleModule,
    SpeedDialModule,
    AppRoutingModule,
    PanelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
