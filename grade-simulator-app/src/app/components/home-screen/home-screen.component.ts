import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { Constants } from '../../utils/constants';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent {
  protected readonly Constants = Constants;
  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate([`/${Constants.ROUTE_PATHS.HOME}/${path}`]);
  }

}
