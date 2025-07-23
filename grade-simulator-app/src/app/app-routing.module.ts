import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenComponent } from "./components/home-screen/home-screen.component";
import { EnStatsComponent } from "./components/en-stats/en-stats.component";
import { BacStatsComponent } from "./components/bac-stats/bac-stats.component";

const routes: Routes = [
  { path: 'simulare-evaluare2025', component: HomeScreenComponent },
  { path: 'simulare-evaluare2025/repartizare', component: EnStatsComponent },
  { path: 'simulare-evaluare2025/bac', component: BacStatsComponent },
  { path: '', redirectTo: '/simulare-evaluare2025', pathMatch: 'full' },
  { path: '**', redirectTo: '/simulare-evaluare2025' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
