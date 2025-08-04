import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../utils/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getBacStatsData(): Observable<any[]> {
    return this.http.get<any[]>(Constants.DATA_API_BASE_URL);
  }

  getEnAppealsData(): Observable<any[]> {
    return this.http.get<any[]>(Constants.DATA_API_BASE_EN_APPEALS_URL);
  }
}
