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
import { GalleriaModule } from 'primeng/galleria';
import { HomeComponent } from './components/main/home/home.component';
import { MainComponent } from './components/main/main.component';
import { GalleryComponent } from './components/main/gallery/gallery.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './components/loading/loading.component';
import { ContactsComponent } from './components/main/contacts/contacts.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    HeaderComponent,
    LogoComponent,
    HomeComponent,
    MainComponent,
    GalleryComponent,
    LoadingComponent,
    ContactsComponent
  ],
  imports: [
    BrowserModule,
    ButtonModule,
    RippleModule,
    SpeedDialModule,
    AppRoutingModule,
    PanelModule,
    GalleriaModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
