import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PassengerDataService {

  public selectedPassengerIndex: number | null = null;
  private passengerDataSource = new BehaviorSubject<any>(null);

  constructor() {
  }

  private eventSource = new Subject<string>();
  event$ = this.eventSource.asObservable();

  sendEvent(message: string) {
    this.eventSource.next(message);
  }

  setPassengersDataList(passengers: any[]) {
    this.passengerDataSource.next(passengers);
  }

  getPassengersDataList() {
    return this.passengerDataSource.asObservable();
  }

  cleanPassengerData(data: any[]): any[] {
    return data.filter(item => item.name && item.surname && item.documentNumber);
  }
}
