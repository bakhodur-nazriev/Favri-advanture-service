import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'https://integration.cbt.tj/api/flytj/passenger/list';

  constructor(private http: HttpClient) {}

  getPassengers(walletPhone: string): Observable<any> {
    const params = new HttpParams().set('walletPhone', walletPhone);
    return this.http.get<any>(this.apiUrl, { params });
  }
}
