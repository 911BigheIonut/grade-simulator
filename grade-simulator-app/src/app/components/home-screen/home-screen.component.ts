import { Component } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent {
  constructor(private router: Router) {}

  navigateTo(path: string): void {
    this.router.navigate([`/simulare-evaluare2025/${path}`]);
  }
}
