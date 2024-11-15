import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PassengerDataService {

  constructor() {
  }

  private passengerDataSource = new BehaviorSubject<any>(null);

  passengerData$ = this.passengerDataSource.asObservable();

  updatePassengerData(data: any) {
    this.passengerDataSource.next(data);
  }

  cleanPassengerData(data: any[]): any[] {
    return data.filter(item => item.name && item.surname && item.documentNumber);
  }
}
