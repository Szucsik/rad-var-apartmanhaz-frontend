import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './components/mains/start/start.component';
import { HeaderComponent } from './components/mains/header/header.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SpeedDialModule } from 'primeng/speeddial';
import { LogoComponent } from './components/mains/logo/logo.component';
import { PanelModule } from 'primeng/panel';
import { GalleriaModule } from 'primeng/galleria';
import { HomeComponent } from './components/pages/home/home.component';
import { MainComponent } from './components/pages/main.component';
import { GalleryComponent } from './components/pages/gallery/gallery.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './components/mains/loading/loading.component';
import { ContactsComponent } from './components/pages/contacts/contacts.component';
import { NearbyComponent } from './components/pages/nearby/nearby.component';
import { LogoStartComponent } from './components/mains/logo-start/logo-start.component';

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
    ContactsComponent,
    NearbyComponent,
    LogoStartComponent,
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
