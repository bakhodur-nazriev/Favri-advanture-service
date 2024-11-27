import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute} from '@angular/router';
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {PassengerDataService} from "../services/passenger-data.service";
import {finalize, Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {ModalOrderSucceedComponent} from "../modal-order-succeed/modal-order-succeed.component";

@Component({
  selector: 'app-order-ticket-modal',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    FormsModule,
    NgForOf,
    ModalOrderSucceedComponent
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
  private apiUrl = 'https://integration.cbt.tj/api/flytj/book';
  //private apiUrl = 'http://192.168.40.238:9800/api/flytj/book';
  // private apiUrl = 'http://localhost:5273/api/flytj/book';
  passengersList: any[] = [];

  constructor(
    private passengerDataService: PassengerDataService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
  }

  public isLoading: boolean = false;
  public isValidationTriggered = false;
  public isVisible: boolean = false;
  public isAnimating: boolean = false;
  public email: string = '';
  public phone: string = '';
  public walletPhone: string = "123456789";

  getPassengerList() {
    let passengerList = [];
    for (let i = 1; i <= this.passengers.adults; i++) {
      passengerList.push({
        count: `Пассажир ${i}`,
        type: 'Взрослый, старше 12 лет',
        passengerType: 'adt'
      });
    }

    for (let i = 1; i <= this.passengers.children; i++) {
      passengerList.push({
        count: `Пассажир ${i + this.passengers.adults}`,
        type: 'Детей от 2 до 12 лет',
        passengerType: 'chd'
      });
    }

    for (let i = 1; i <= this.passengers.infantsWithSeat; i++) {
      passengerList.push({
        count: `Пассажир ${i + this.passengers.adults + this.passengers.children}`,
        type: 'Младенец с местом',
        passengerType: 'inf'
      });
    }

    for (let i = 1; i <= this.passengers.infantsWithoutSeat; i++) {
      passengerList.push({
        count: `Пассажир ${i + this.passengers.adults + this.passengers.children + this.passengers.infantsWithSeat}`,
        type: 'Младенец без места',
        passengerType: 'inf'
      });
    }
    return passengerList;
  }

  onAnimationEvent(event: AnimationEvent) {
    if (event.phaseName === 'done' && event.toState === 'void') {
      this.isAnimating = false;
      this.isVisible = false;
    }
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    const modalBlock = document.querySelector('.tickets-modal__block') as HTMLElement;
    if (modalBlock) {
      modalBlock.style.display = '';
    }
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
    this.passengerDataService.selectedPassengerIndex = index;
    this.passengerDataService.sendEvent(passenger);
    this.detailPassengerSelected.emit(passenger);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['walletPhone']) {
        this.walletPhone = params['walletPhone'];
      }
    });

    this.passengerDataService.getPassengersDataList().subscribe((data) => {
      this.passengersList = data;
    });
  }

  createOrderRequest() {
    if (!this.isValidForm()) {
      this.isValidationTriggered = true;

      return;
    }

    const convertToISO = (dateString: string) => {
      const [day, month, year] = dateString.split('.').map(Number);
      const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0)); // Set to UTC midnight
      return date.toISOString(); // Convert to ISO string
    };

    const passengers = this.passengersList.map((passenger, index) => ({
      ...passenger,
      index: index,
      expiration_date: convertToISO(passenger.expiration_date),
      date_of_birth: convertToISO(passenger.date_of_birth),
    }));

    const requestBody = {
      walletPhone: this.walletPhone,
      token: sessionStorage.getItem('token'),
      url: window.location.href,
      session_id: sessionStorage.getItem('sessionId'),
      rec_id: this.flight.value.rec_id,
      partner_fees: this.flight.value.partner_fees.TJS,
      payer_phone: '+992' + this.walletPhone,
      payer_email: this.email,
      passengers: passengers,
      meta: {
        currency: "TJS",
        language: "tj",
      },
      company_req_id: sessionStorage.getItem('company_req_id'),
    };

    try {
      const clonedRequestBody = structuredClone(requestBody);
      console.log("Cloned Request Body: ", clonedRequestBody);
    } catch (e) {
      console.error("Error during cloning:", e);
    }

    this.sendOrderRequest(requestBody).subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          window.location.href = response.data.paymentUrl;
          console.log('Заказ успешно создан', response);
        }
      },
      error: (error) => {
        console.error('Ошибка при отправке запроса:', error);
      }
    });
  }

  sendOrderRequest(data: any): Observable<any> {
    this.isLoading = true;
    return this.http.post(this.apiUrl, data).pipe(
      tap({
        next: (response: any) => {
          if (response && response.success) {
            console.log('Заказ успешно создан', response);
          }
        },
        error: (error) => {
          console.error('Ошибка при отправке запроса:', error);
        }
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  isValidForm(): boolean {
    return this.walletPhone.length > 0;
  }
}
