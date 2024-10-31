import {Component, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CustomInputComponent} from "./custom-input/custom-input.component";
import {NgIf, NgOptimizedImage} from "@angular/common";
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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  @ViewChild('directionFromModalComponent') directionFromModalComponent!: DirectionFromModalComponent;
  @ViewChild('directionToModalComponent') directionToModalComponent!: DirectionToModalComponent;
  @ViewChild('modalPassengers') modalPassengers!: ModalPassengersComponent;
  @ViewChild('datepickerModalComponent') datepickerModalComponent!: DatepickerModalComponent;
  @ViewChild('ticketsModal') ticketsModal!: TicketsModalComponent;
  @ViewChild('preorderModal') preorderModal!: PreorderModalComponent;
  @ViewChild('orderTicketModal') orderTicketModal!: OrderTicketModalComponent;

  public fromPlaceholder: string = 'Откуда';
  public toPlaceholder: string = 'Куда';
  public passengers: Passengers = {
    adults: 1,
    children: 0,
    infantsWithSeat: 0,
    infantsWithoutSeat: 0,
    travelClass: 'economy'
  }
  public travelClass: string = 'Эконом';
  public selectedDateText: string;
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

  constructor(private http: HttpClient) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.selectedStartDate = tomorrow;

    this.selectedDateText = tomorrow.toLocaleDateString('ru-RU', {month: 'short', day: 'numeric'});
  }

  onFlightSelected(flight: any) {
    console.log('Выбранный рейс:', flight);
    this.selectedFlight = flight;
    this.preorderModal.openModal(flight);
  }

  orderFlightSelected(flight: any){
    this.selectedFlight = flight;
    this.preorderModal.closeModal();
    this.orderTicketModal.openModal();
  }

  handlePassengersAndClass(event: Passengers) {
    this.passengers.adults = event.adults;
    this.passengers.children = event.children;
    this.passengers.infantsWithSeat = event.infantsWithSeat;
    this.passengers.infantsWithoutSeat = event.infantsWithoutSeat;
    this.passengers.travelClass = event.travelClass;
  }

  openDirectionFromModal() {
    this.directionFromModalComponent.openModal();
  }

  openDirectionToModal() {
    this.directionToModalComponent.openModal();
  }

  swapLocations() {
    const temp = this.fromAirportCode;
    this.fromAirportCode = this.toAirportCode;
    this.toAirportCode = temp;

    const tempPlaceholder = this.fromPlaceholder;
    this.fromPlaceholder = this.toPlaceholder;
    this.toPlaceholder = tempPlaceholder;
  }

  onDirectionFromSelected(direction: any) {
    this.fromCity = direction.city;
    this.fromAirportCode = direction.airportCode;
    console.log('Выбранный город:', this.fromCity, 'Код аэропорта:', this.fromAirportCode);
  }

  onDirectionToSelected(direction: any) {
    this.toCity = direction.city;
    this.toAirportCode = direction.airportCode;
    console.log('Выбранный город:', this.toCity, 'Код аэропорта:', this.toAirportCode);
  }

  openModalPassengers() {
    this.modalPassengers.openModal();
  }

  handleSelectedDates(dates: { startDate: Date, endDate: Date | null }) {
    this.selectedStartDate = dates.startDate;
    this.selectedEndDate = dates.endDate;

    const formatMonth = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = {month: 'short', day: 'numeric'};
      return date.toLocaleDateString('ru-RU', options);
    };

    if (dates.startDate && dates.endDate) {
      this.selectedDateText = `${formatMonth(dates.startDate)} - ${formatMonth(dates.endDate)}`;
    } else if (dates.startDate) {
      this.selectedDateText = formatMonth(dates.startDate);
    } else {
      this.selectedDateText = new Date().toLocaleDateString('ru-RU', {month: 'short', day: 'numeric'});
    }
  }

  searchTickets() {
    const url = 'https://bft-alpha.55fly.ru/api/search';
    this.ticketsModal.openModal();
    this.isLoading = true;

    const today = new Date();
    const formattedDate = this.selectedStartDate
      ? this.selectedStartDate.toISOString().split('T')[0]
      : `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    let params = new HttpParams()
      .set('passengers[adt]', this.passengers.adults.toString())
      .set('passengers[chd]', this.passengers.children.toString())
      .set('passengers[ins]', this.passengers.infantsWithSeat.toString())
      .set('passengers[inf]', this.passengers.infantsWithoutSeat.toString())
      .set('routes[0][from]', this.fromAirportCode)
      .set('routes[0][to]', this.toAirportCode)
      .set('routes[0][date]', formattedDate)
      // .set('routes[1][from]', this.to)
      // .set('routes[1][to]', this.from)
      // .set('routes[1][date]', '2024-10-12')
      .set('flight_type', 'OW')
      .set('cabin', this.passengers.travelClass.toLowerCase())
      .set('company_req_id', '26')
      .set('language', 'ru');

    this.http.get(url, {params}).subscribe((response: any) => {
      console.log('Результаты поиска:', response.data);
      this.flights = response.data.flights;
      this.included = response.data.included;
      this.isLoading = false;
    });
  }
}
