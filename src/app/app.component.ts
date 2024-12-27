import {Component, ViewChild, OnInit, LOCALE_ID} from '@angular/core';
import {RouterOutlet, ActivatedRoute, Router} from '@angular/router';
import {CustomInputComponent} from "./custom-input/custom-input.component";
import {NgIf, NgOptimizedImage, registerLocaleData} from "@angular/common";
import {ModalPassengersComponent} from "./modal-passengers/modal-passengers.component";
import {DatepickerModalComponent} from "./datepicker-modal/datepicker-modal.component";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {DirectionFromModalComponent} from './direction-from-modal/direction-from-modal.component'
import {DirectionToModalComponent} from "./direction-to-modal/direction-to-modal.component";
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpParams} from '@angular/common/http';
import {Passengers} from "./models/passengers.interface";
import {TicketsModalComponent} from "./tickets-modal/tickets-modal.component";
import {PreorderModalComponent} from "./preorder-modal/preorder-modal.component";
import {Included} from "./models/flights-included.interface";
import {OrderTicketModalComponent} from "./order-ticket-modal/order-ticket-modal.component";
import {DetailPassengerModalComponent} from "./detail-passenger-modal/detail-passenger-modal.component";
import sha512 from 'crypto-js/sha512';
import {format} from 'date-fns';
import dayjs from 'dayjs';
import {ModalOrderSucceedComponent} from "./modal-order-succeed/modal-order-succeed.component";
import {PassengerDataService} from "./services/passenger-data.service";
import localeRu from '@angular/common/locales/ru';
import {ProfileComponent} from "./profile/profile.component";

registerLocaleData(localeRu);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CustomInputComponent,
    NgOptimizedImage,
    ModalPassengersComponent,
    DatepickerModalComponent,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    DirectionFromModalComponent,
    DirectionToModalComponent,
    FormsModule,
    TicketsModalComponent,
    PreorderModalComponent,
    NgIf,
    OrderTicketModalComponent,
    DetailPassengerModalComponent,
    ModalOrderSucceedComponent,
    ProfileComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {provide: LOCALE_ID, useValue: 'ru-RU'}
  ],
})

export class AppComponent implements OnInit {
  @ViewChild('directionFromModalComponent') directionFromModalComponent!: DirectionFromModalComponent;
  @ViewChild('directionToModalComponent') directionToModalComponent!: DirectionToModalComponent;
  @ViewChild('modalPassengers') modalPassengers!: ModalPassengersComponent;
  @ViewChild('datepickerModalComponent') datepickerModalComponent!: DatepickerModalComponent;
  @ViewChild('ticketsModal') ticketsModal!: TicketsModalComponent;
  @ViewChild('preorderModal') preorderModal!: PreorderModalComponent;
  @ViewChild('orderTicketModal') orderTicketModal!: OrderTicketModalComponent;
  @ViewChild('detailPassengerModal') detailPassengerModal!: DetailPassengerModalComponent
  @ViewChild('modalOrderSucceed') modalOrderSucceed!: ModalOrderSucceedComponent

  private readonly companyReqId = 26;
  private readonly secretKey = '98357c92347b70b6bc0ea97f0acf84040sa2dof5ba7411218c3f1087316fd3663fc6f99';
  private readonly apiUrl = 'https://bft-alpha.55fly.ru/api';

  public fromPlaceholder: string = 'Откуда';
  public toPlaceholder: string = 'Куда';
  public passengers: Passengers = {
    adults: 1,
    children: 0,
    infantsWithSeat: 0,
    travelClass: 'economy'
  }

  public tempPassengers: Passengers = {
    adults: 1,
    children: 0,
    infantsWithSeat: 0,
    travelClass: 'economy'
  };

  public travelClass: string = 'Эконом';
  public selectedDateText: string = '';
  public isLoading: boolean = false;

  public fromCity = 'Душанбе';
  public toCity = 'Москва';
  public fromAirportCode = 'DYU';
  public toAirportCode = 'MOW';
  public flights: any[] = [];
  public included: Included | undefined;
  public selectedStartDate: Date | null = null;
  public selectedEndDate: Date | null = null;
  selectedFlight: any;
  public selectedPassenger: any;
  public isProfileModalOpen: boolean = false;

  public passengerCount: number = 0;
  public travelClassText: string = '';
  isPassengerFormValid: boolean = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private passengerDataService: PassengerDataService) {
  }

  onValidationStatusChanged(isValid: boolean): void {
    this.isPassengerFormValid = isValid;
  }

  onFlightSelected(flight: any) {
    this.selectedFlight = flight;
    this.preorderModal.openModal(flight);
  }

  orderFlightSelected(flight: any) {
    this.selectedFlight = flight;
    this.orderTicketModal.openModal();
    this.preorderModal.closeModal();
  }

  openDetailPassengerModal(passenger: any) {
    this.selectedPassenger = passenger;
    this.detailPassengerModal?.openModal();
  }

  openDirectionFromModal() {
    this.directionFromModalComponent.openModal();
  }

  openDirectionToModal() {
    this.directionToModalComponent.openModal();
  }

  swapLocations() {
    const tempCode = this.fromAirportCode;
    this.fromAirportCode = this.toAirportCode;
    this.toAirportCode = tempCode;

    const tempCity = this.fromCity;
    this.fromCity = this.toCity;
    this.toCity = tempCity;

    const tempPlaceholder = this.fromPlaceholder;
    this.fromPlaceholder = this.toPlaceholder;
    this.toPlaceholder = tempPlaceholder;
  }

  onDirectionFromSelected(direction: any) {
    this.fromCity = direction.city;
    this.fromAirportCode = direction.airportCode;
  }

  onDirectionToSelected(direction: any) {
    this.toCity = direction.city;
    this.toAirportCode = direction.airportCode;
  }

  openModalPassengers() {
    this.modalPassengers.openModal();
  }

  private getCurrentDate(): string {
    return format(new Date(), 'yyyyMMdd');
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('ru-RU', {month: 'short', day: 'numeric'});
  }

  handlePassengersAndClass(event: Passengers) {
    this.tempPassengers = {...event};
    this.calculatePassengerCount();
    this.travelClassText = this.getTravelClassText(event.travelClass);
  }

  handleSelectedDates(dates: { startDate: Date, endDate: Date | null }) {
    this.selectedStartDate = dates.startDate;
    this.selectedEndDate = dates.endDate;

    if (dates.startDate && dates.endDate) {
      this.selectedDateText = `${this.formatDate(dates.startDate)} - ${this.formatDate(dates.endDate)}`;
    } else if (dates.startDate) {
      this.selectedDateText = this.formatDate(dates.startDate);
    } else {
      const today = new Date();
      this.selectedDateText = this.formatDate(today);
    }

    this.selectedDateText = this.generateSelectedDateText(dates);
  }

  private getTravelClassText(travelClass: string): string {
    switch (travelClass.toLowerCase()) {
      case 'economy':
        return 'Эконом';
      case 'business':
        return 'Бизнес';
      case 'first':
        return 'Первый класс';
      default:
        return 'Эконом';
    }
  }

  private generateSelectedDateText(dates: { startDate: Date, endDate: Date | null }): string {
    if (dates.startDate && dates.endDate) {
      return `${this.formatDate(dates.startDate)} - ${this.formatDate(dates.endDate)}`;
    } else if (dates.startDate) {
      return this.formatDate(dates.startDate);
    } else {
      return this.formatDate(new Date());
    }
  }

  searchTickets() {
    this.passengerDataService.sendPassengersEvent(this.tempPassengers);

    this.passengers = {...this.tempPassengers};
    const url = `${this.apiUrl}/search`;
    this.ticketsModal.openModal();
    this.isLoading = true;

    const formattedDate = this.selectedStartDate
      ? dayjs(this.selectedStartDate).format('YYYY-MM-DD')
      : dayjs().format('YYYY-MM-DD');

    const companyReqId = sessionStorage.getItem('company_req_id') || '26';

    let params = new HttpParams()
      .set('passengers[adt]', this.passengers.adults.toString())
      .set('passengers[chd]', this.passengers.children.toString())
      .set('passengers[ins]', this.passengers.infantsWithSeat.toString())
      .set('passengers[inf]', 0)
      .set('routes[0][from]', this.fromAirportCode)
      .set('routes[0][to]', this.toAirportCode)
      .set('routes[0][date]', formattedDate)
      .set('flight_type', this.selectedEndDate ? 'RT' : 'OW')
      .set('cabin', this.passengers.travelClass.toLowerCase())
      .set('company_req_id', companyReqId)
      .set('language', 'ru');

    if (this.selectedEndDate) {
      params = params
        .set('routes[1][from]', this.toAirportCode)
        .set('routes[1][to]', this.fromAirportCode)
        .set('routes[1][date]', dayjs(this.selectedEndDate).format('YYYY-MM-DD'));
    }

    const token = sessionStorage.getItem('token');

    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      this.http.get(url, {params, headers}).subscribe(
        (response: any) => {
          sessionStorage.setItem('sessionId', response.data.session);
          this.flights = response.data.flights;
          this.included = response.data.included;
          this.isLoading = false;
        },
        (error) => {
          console.error('Search ticket error:', error);
          this.isLoading = false;
        }
      );
    } else {
      console.error('Token is not available.');
      this.isLoading = false;
    }
  }

  private generateSignature(login: string, date: string): string {
    const signatureString = `${login}${this.companyReqId}${this.secretKey}${date}`;
    return sha512(signatureString).toString();
  }

  login(walletPhone: string) {
    const date = this.getCurrentDate();
    const signature = this.generateSignature(walletPhone, date);

    const loginData = {
      date: date,
      company_req_id: this.companyReqId,
      login: walletPhone,
      signature: signature
    }

    return this.http.post(`${this.apiUrl}/wallet/auth`, loginData).subscribe(
      (response: any) => {
        sessionStorage.setItem('token', response.token);
      },
      (error) => {
        console.error('Login error:', error);
      }
    );
  }

  ngOnInit() {
    const tomorrow = dayjs().add(1, 'day').toDate();
    this.selectedStartDate = tomorrow;
    this.selectedDateText = this.formatDate(tomorrow);

    sessionStorage.setItem('company_req_id', '4');

    this.route.queryParams.subscribe(params => {
      const walletPhone = params['walletPhone'];
      if (walletPhone) {
        this.login(walletPhone);
      } else {
        console.error('walletPhone не найден в параметрах URL');
      }
    });

    this.calculatePassengerCount();
    this.travelClassText = this.getTravelClassText(this.passengers.travelClass);
  };

  private calculatePassengerCount() {
    const {adults, children, infantsWithSeat} = this.passengers;
    this.passengerCount = adults + children + infantsWithSeat;
  }

  openProfile() {
    this.isProfileModalOpen = true
  }
}
