import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {PassengerDataService} from "../services/passenger-data.service";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {stringify as flattedStringify} from 'flatted';
import {FormsModule} from "@angular/forms";
import {Passengers} from "../models/passengers.interface";

@Component({
  selector: 'app-order-ticket-modal',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    FormsModule,
    NgForOf
  ],
  templateUrl: './order-ticket-modal.component.html',
  styleUrl: './order-ticket-modal.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('0.15s ease-in', style({transform: 'translateY(0)', opacity: 1}))
      ]),
      transition(':leave', [
        animate('0.15s ease-out', style({transform: 'translateY(100%)', opacity: 0}))
      ])
    ])
  ]
})
export class OrderTicketModalComponent implements OnInit {
  @Input() flight!: any;
  @Input() passengers: {
    children: number;
    infantsWithoutSeat: number;
    adults: number;
    infantsWithSeat: number
  } = {adults: 0, children: 0, infantsWithSeat: 0, infantsWithoutSeat: 0}
  @Output() detailPassengerSelected = new EventEmitter<any>;
  private apiUrl = 'http://192.168.40.238:9800/api/flytj/book';
  //private apiUrl = 'http://localhost:5273/api/flytj/book';
  passengersList: any[] = [];

  constructor(private passengerDataService: PassengerDataService, private http: HttpClient) {
  }

  public isVisible: boolean = false;
  public isAnimating: boolean = false;
  public email: string = '';
  public phone: string = '';

  getPassengerList() {
    let passengerList = [];
    for (let i = 1; i <= this.passengers.adults; i++) {
      passengerList.push({count: `Пассажир ${i}`, type: 'Взрослый, старше 12 лет',});
    }

    for (let i = 1; i <= this.passengers.children; i++) {
      passengerList.push({count: `Пассажир ${i + this.passengers.adults}`, type: 'Детей от 2 до 12 лет'});
    }

    for (let i = 1; i <= this.passengers.infantsWithSeat; i++) {
      passengerList.push({
        count: `Пассажир ${i + this.passengers.adults + this.passengers.children}`,
        type: 'Младенец с местом'
      });
    }

    for (let i = 1; i <= this.passengers.infantsWithoutSeat; i++) {
      passengerList.push({
        count: `Пассажир ${i + this.passengers.adults + this.passengers.children + this.passengers.infantsWithSeat}`,
        type: 'Младенец без места'
      });
    }
    return passengerList;
  }

  onAnimationEvent(event: AnimationEvent) {
    if (event.phaseName === 'done' && event.toState === 'void') {
      this.isVisible = false;
      this.isAnimating = false;
    }
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  convertDuration(duration: number): string {
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor(duration % 3600) / 60;

    let result = 'В пути ';

    if (hours > 0) {
      result += `${hours} ч `;
    }

    if (minutes > 0) {
      result += `${minutes} мин`
    }

    return result.trim();
  }

  extractHours(time: string): string {
    return time.split(' ')[1]
  }

  selectPassenger(passenger: any, index: number) {
    this.detailPassengerSelected.emit(passenger);
    this.passengerDataService.selectedPassengerIndex = index;
    this.passengerDataService.sendEvent('From order component');
  }

  ngOnInit() {
    this.passengerDataService.getPassengersDataList().subscribe((data) => {
      this.passengersList = data;
      console.log('Получен список пассажиров:', this.passengersList);
    });
  }

  createOrderRequest() {
    debugger
    const passengers = this.passengersList.map((passenger, index) => ({
      ...passenger,
      index: index
    }));

    const requestBody = {
      walletPhone: "123456789",
      token: sessionStorage.getItem('token'),
      url: window.location.href,
      session_id: sessionStorage.getItem('sessionId'),
      rec_id: this.flight.value.rec_id,
      partner_fees: this.flight.value.partner_fees.TJS,
      payer_phone: this.phone,
      payer_email: this.email,
      passengers: passengers,
      meta: {
        currency: "TJS",
        language: "ru",
      },
      company_req_id: 4
    };

    try {
      const clonedRequestBody = structuredClone(requestBody);
      console.log("Cloned Request Body: ", clonedRequestBody);
    } catch (e) {
      console.error("Error during cloning:", e);
    }

    this.sendOrderRequest(requestBody).subscribe({
      next: (response) => {
        if (response && response.success) {
          console.log('Заказ успешно создан', response);
        }
      },
      error: (error) => {
        console.error('Ошибка при отправке запроса:', error);
      }
    });
  }

  sendOrderRequest(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
