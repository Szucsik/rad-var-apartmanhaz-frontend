import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './components/mains/start/start.component';
import { HeaderComponent } from './components/mains/header/header.component';
import { LogoComponent } from './components/mains/logo/logo.component';
import { HomeComponent } from './components/pages/home/home.component';
import { MainComponent } from './components/pages/main.component';
import { GalleryComponent } from './components/pages/gallery/gallery.component';
import { LoadingComponent } from './components/mains/loading/loading.component';
import { ContactsComponent } from './components/pages/contacts/contacts.component';
import { NearbyComponent } from './components/pages/nearby/nearby.component';
import { LogoStartComponent } from './components/mains/logo-start/logo-start.component';
import { FullscreenComponent } from './components/pages/gallery/fullscreen/fullscreen.component';
import { BookingComponent } from './components/pages/booking/booking.component';
import { GallerySwiperComponent } from './components/pages/gallery/swiper/swiper.component';
import { HistoryComponent } from './components/pages/history/history.component';
import { PageOneComponent } from './components/pages/history/page-one/page-one.component';
import { PageTwoComponent } from './components/pages/history/page-two/page-two.component';
import { PageThreeComponent } from './components/pages/history/page-three/page-three.component';
import { RippleDirective } from './shared/directives/ripple.directive';

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
    FullscreenComponent,
    BookingComponent,
    GallerySwiperComponent,
    HistoryComponent,
    PageOneComponent,
    PageTwoComponent,
    PageThreeComponent,
    RippleDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
