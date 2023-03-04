import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MainScreenComponent } from './mainScreen/mainScreen.component';
import { FavoritesComponent } from './favorites/favorites.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import { AccuweatherIconPipe } from './pipes/accuweather-icon.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MainScreenComponent,
    FavoritesComponent,
    AccuweatherIconPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
