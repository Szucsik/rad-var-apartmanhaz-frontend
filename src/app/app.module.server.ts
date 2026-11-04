import { NgModule } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { serverRoutes } from './app.routes.server';
import { TRANSLATIONS_LOADER } from './shared/services/translations-loader';
import { FileTranslationsLoader } from './shared/services/translations-loader.server';

@NgModule({
  imports: [AppModule],
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // AppModule provides the fetch version for the browser; the server reads the YAML from disk.
    { provide: TRANSLATIONS_LOADER, useClass: FileTranslationsLoader },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
