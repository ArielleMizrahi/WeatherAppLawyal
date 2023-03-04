import {Component} from '@angular/core';
import {Mode} from './model/mode.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {

  mode = Mode.Light;

  switchMode(mode) {
    if (mode === Mode.Light) {
      document.querySelector('body').style.setProperty('--bg-color', '#272727');
      document.querySelector('body').style.setProperty('--text-color', '#f8fafb');
      this.mode = Mode.Dark;
    } else {
      document.querySelector('body').style.setProperty('--bg-color', '#f8fafb');
      document.querySelector('body').style.setProperty('--text-color', '#272727');
      this.mode = Mode.Light;
    }
  }
}
