import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// The page has no routed views: the first path segment only selects the language (/hu, /pl, /en, /de)
// and is handled by I18nService. The wildcard keeps the router from rejecting those URLs.
const routes: Routes = [
  { path: '**', children: [] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
