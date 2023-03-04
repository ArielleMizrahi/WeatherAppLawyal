import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {ADD_FAIVORITE, DEFAULT_LAT, DEFAULT_LNG, REMOVE_FAIVORITE} from '../app.consts';
import {GeoPositionRes} from '../model/geo-position';
import {DailyForecast, FiveDaysForecast} from '../model/5-days-forecast';
import {Subject} from 'rxjs';
import {debounceTime, filter, switchMap, takeUntil} from 'rxjs/operators';
import {AutoCompleteSuggestions} from '../model/auto-complete-suggestions';
import {WeatherService} from '../weather.service';

@Component({
  selector: 'app-mainScreen',
  templateUrl: './mainScreen.component.html',
  styleUrls: ['./mainScreen.component.scss']
})
export class MainScreenComponent implements OnInit, OnDestroy {
  autoCompleteInput = new Subject();
  autoCompleteValue;
  autoCompletedSuggestions: AutoCompleteSuggestions[];
  cityName: string;
  headLine: string;
  forecasts: DailyForecast[];
  favoriteState;
  selectedKey: any;

  constructor(protected appService: AppService, protected weatherService: WeatherService) {
  }

  ngUnSubscribe: Subject<void> = new Subject<void>();

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const {latitude, longitude} = position.coords;
        this.appService.getGeoPosition(latitude, longitude).subscribe((data: GeoPositionRes) => {
          this.handleInitPosition(data);
        });
      });
    } else {
      this.appService.getGeoPosition(DEFAULT_LAT, DEFAULT_LNG).subscribe((data: GeoPositionRes) => {
        this.handleInitPosition(data);
      });
    }


    this.autoCompleteInput
      .pipe(
        filter((data: string) => data.length > 0),
        takeUntil(this.ngUnSubscribe),
        debounceTime(300),
        switchMap((data: string) => {
          return this.appService.getAutoComplete(data);
        })
      )
      .subscribe((suggestions: AutoCompleteSuggestions[]) => {
        this.autoCompletedSuggestions = suggestions;
      });
  }


  private getFavoriteState(Key: string) {
    const storeState = this.weatherService.get();
    return storeState[Key] ? REMOVE_FAIVORITE : ADD_FAIVORITE;
  }

  selectSuggestion(suggestion: AutoCompleteSuggestions) {
    this.favoriteState          = this.getFavoriteState(suggestion.Key);
    this.cityName          = `${suggestion.LocalizedName},${suggestion.Country.LocalizedName}`;
    this.autoCompleteValue = this.cityName;
    this.getFiveDays(suggestion.Key);
    this.autoCompletedSuggestions = null;
  }


  private handleInitPosition(geoPositionRes: GeoPositionRes) {
    this.favoriteState    = this.getFavoriteState(geoPositionRes.Key);
    this.cityName    = `${geoPositionRes.ParentCity.EnglishName},${geoPositionRes.Country.EnglishName}`;
    this.getFiveDays(geoPositionRes.Key);
  }


  ngOnDestroy(): void {
    this.ngUnSubscribe.next();
    this.ngUnSubscribe.complete();
  }


  getFiveDays(key) {
    this.selectedKey = key;
    this.appService.get5DaysOfForecasts(key).subscribe((fiveDaysForecastData: FiveDaysForecast) => {
      this.headLine  = fiveDaysForecastData.Headline.Text;
      this.forecasts = fiveDaysForecastData.DailyForecasts;
    });
  }


  toggleFavorites() {
    const favoriteState = this.getFavoriteState(this.selectedKey);
    const selectedCity = {
      key: this.selectedKey,
      cityName: this.cityName
    };
    if (favoriteState === ADD_FAIVORITE) {
      this.weatherService.add(selectedCity);
    } else {
      this.weatherService.remove(selectedCity);
    }

    this.favoriteState = favoriteState === ADD_FAIVORITE ? REMOVE_FAIVORITE : ADD_FAIVORITE;


  }
}
