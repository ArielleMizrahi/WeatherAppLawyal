import {Injectable} from '@angular/core';
import {ObservableStore} from '@codewithdan/observable-store';
import {AppService} from './app.service';
import {map} from 'rxjs/operators';
import {CurrentConditions} from './model/current-conditions';


@Injectable({
  providedIn: 'root'
})
export class WeatherService extends ObservableStore<{}> {

  constructor(protected appService: AppService) {

    super({trackStateHistory: true});

  }

  add(favoriteCity) {
    const state = this.getState() || {};

    this.appService.getCurrentConditions(favoriteCity.key)
      .pipe(map((data) => data[0]))
      .subscribe((data: CurrentConditions) => {
          state[favoriteCity.key] = {
            title: favoriteCity.cityName,
            text: data.WeatherText,
            temperature: data.Temperature,
            icon: data.WeatherIcon
          };
          console.log(state);
          this.setState(state,
            'add_favoriteCity');
        }
      );


  }

  remove(favoriteCity) {
    const state = this.getState() || {};
    delete state[favoriteCity.key];
    this.setState(state,
      'remove_favoriteCity');
  }

  get() {
    return this.getState() || {};
  }

}
