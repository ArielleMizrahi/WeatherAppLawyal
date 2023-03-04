import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FavoritesComponent} from './favorites/favorites.component';
import {MainScreenComponent} from './mainScreen/mainScreen.component';

const routes: Routes = [
  { path: '', component: MainScreenComponent },
  { path: 'favorites', component: FavoritesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
