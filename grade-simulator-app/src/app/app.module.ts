import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeScreenComponent } from './components/home-screen/home-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EnStatsComponent } from './components/en-stats/en-stats.component';
import { BacStatsComponent } from './components/bac-stats/bac-stats.component';
import { MatCardModule } from "@angular/material/card";
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { EnAppealsComponent } from './components/en-appeals/en-appeals.component';
import { DegreeOccupationComponent } from './components/occupation/occupation.component';
import { LastAdmittedComponent } from './components/last-admitted/last-admitted.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
    EnStatsComponent,
    BacStatsComponent,
    EnAppealsComponent,
    DegreeOccupationComponent,
    LastAdmittedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    NgChartsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
