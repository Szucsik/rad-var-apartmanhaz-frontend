import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// The page has no routed views: the first path segment only selects the language (/hu, /pl, /en, /de)
// and is handled by I18nService. The routes also have to exist for app.routes.server.ts.
const routes: Routes = [
  { path: '', children: [] },
  { path: 'hu', children: [] },
  { path: 'pl', children: [] },
  { path: 'en', children: [] },
  { path: 'de', children: [] },
  { path: '**', children: [] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
