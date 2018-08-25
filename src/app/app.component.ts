import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app',
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit{
  theme: string;

  constructor() {}

  ngOnInit() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser !== null) {
      this.theme = 'theme-' + currentUser.theme.toLowerCase();
    } else {
      this.theme = 'theme-magazine';
    }
  }
}
