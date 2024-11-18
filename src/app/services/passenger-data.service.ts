import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PassengerDataService {

  public selectedPassengerIndex: number | null = null;
  constructor() {
  }

  private eventSource = new Subject<string>();
  event$ = this.eventSource.asObservable();

  sendEvent(message: string) {
    this.eventSource.next(message);
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
