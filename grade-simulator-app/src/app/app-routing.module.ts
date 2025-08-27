import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenComponent } from "./components/home-screen/home-screen.component";
import { EnStatsComponent } from "./components/en-stats/en-stats.component";
import { BacStatsComponent } from "./components/bac-stats/bac-stats.component";
import { Constants } from "./utils/constants";
import {EnAppealsComponent} from "./components/en-appeals/en-appeals.component";
import { DegreeOccupationComponent } from './components/occupation/occupation.component';
import { LastAdmittedComponent } from './components/last-admitted/last-admitted.component';

const routes: Routes = [
  {
    path: Constants.ROUTE_PATHS.HOME,
    component: HomeScreenComponent,
    data: { title: Constants.APP_TITLES.HOME }
  },
  {
    path: Constants.ROUTE_PATHS.REPARTIZARE,
    component: EnStatsComponent,
    data: { title: Constants.APP_TITLES.EN }
  },
  {
    path: Constants.ROUTE_PATHS.BAC,
    component: BacStatsComponent,
    data: { title: Constants.APP_TITLES.BAC }
  },
  {
    path: Constants.ROUTE_PATHS.EN_APPEALS,
    component: EnAppealsComponent,
    data: { title: Constants.APP_TITLES.EN_APPEALS }
  },
  {
    path: Constants.ROUTE_PATHS.DEGREE_OCCUPATION,
    component: DegreeOccupationComponent,
    data: { title: Constants.APP_TITLES.DEGREE_OCCUPATION }
  },
  {
    path: Constants.ROUTE_PATHS.LAST_ADMITTED,
    component: LastAdmittedComponent,
    data: { title: Constants.APP_TITLES.LAST_ADMITTED }
  },
  {
    path: '', redirectTo: `/${Constants.ROUTE_PATHS.HOME}`, pathMatch: 'full'
  },
  {
    path: '**', redirectTo: `/${Constants.ROUTE_PATHS.HOME}`
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
