import {Component, EventEmitter, Input, Output, OnInit, HostListener} from '@angular/core';
import {JsonPipe, KeyValuePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-tickets-modal',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    NgForOf,
    KeyValuePipe,
    JsonPipe,
    FormsModule,
  ],
  templateUrl: './tickets-modal.component.html',
  styleUrl: './tickets-modal.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('0.2s ease-in', style({transform: 'translateY(0)', opacity: 1}))
      ]),
      transition(':leave', [
        animate('0.2s ease-out', style({transform: 'translateY(100%)', opacity: 0}))
      ])
    ])
  ]
})
export class TicketsModalComponent {
  @Input() flights: any[] = ['flights'];
  @Input() fromCity!: string;
  @Input() toCity!: string;
  @Input() backRouteCity!: string;
  @Input() isLoading!: boolean;
  @Output() flightSelected = new EventEmitter<any>();
  @Input() passengerCount: number = 0;
  @Input() travelClassText: string = '';
  @Input() selectedDateText: string = '';

  isVisible: boolean = false;
  departureAirport: any;
  arrivalAirport: any;
  flightDuration: string = '';
  public isBookingInfoModal: boolean = false;
  public isModalBookingVisible: boolean = true;

  public isFilterVisible: boolean = false;
  public isFilterAnimating = false;

  public minPrice: number | null = null;
  public maxPrice: number | null = null;
  public selectedBaggage: string = 'С багажом';
  public selectedRefund: string = 'С возвратом';
  public selectedTransfer: string = 'Прямой рейс';
  public selectedTimeFrom: string = '00:00';
  public selectedTimeTo: string = '23:00';

  private originalFlights: any[] = [];
  filteredFlights = [...this.flights];

  public routes: any[] = [
    {
      index: 0,
      duration: 16800,
      segments: [
        {
          departure: {time: "20.10.2024 08:00", airport: "DYU", city: "Душанбе", terminal: ""},
          arrival: {time: "20.10.2024 10:40", airport: "NYC", city: "Нью-Йорк", terminal: ""},
          baggage: "20KG",
        },
      ],
    },
  ];

  constructor() {
    this.originalFlights = [...this.flights];
    this.initializeFlightData();
  }

  closeFilterModal() {
    if (!this.isFilterAnimating) {
      this.isFilterVisible = false;
      this.isFilterAnimating = true;
    }
  }

  onAnimationFilterModal(event: AnimationEvent) {
    if (event.phaseName === 'done') {
      this.isFilterAnimating = false;
      if (event.toState === 'void') {
        this.isFilterVisible = false;
      }
    }
  }

  selectFlight(flight: any) {
    this.flightSelected.emit(flight);
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }

  initializeFlightData() {
    const firstRoute = this.routes[0];
    const firstSegment = firstRoute.segments[0];

    this.departureAirport = firstSegment.departure;

    this.arrivalAirport = firstSegment.arrival;

    const hours = Math.floor(firstRoute.duration / 3600);
    const minutes = Math.floor((firstRoute.duration % 3600) / 60);
    this.flightDuration = `${hours}ч ${minutes}мин`;
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

  openBookingInfoModal() {
    const ticketModalBlock = document.querySelector('.tickets-modal__block');
    if (ticketModalBlock) {
      ticketModalBlock.classList.add('overflow-hidden');
      ticketModalBlock.classList.add('h-100');
    }

    this.isBookingInfoModal = true;
  }

  closeBookingInfoModal() {
    const ticketModalBlock = document.querySelector('.tickets-modal__block');
    if (ticketModalBlock) {
      ticketModalBlock.classList.remove('overflow-hidden');
      ticketModalBlock.classList.remove('h-100')
    }

    this.isBookingInfoModal = false;
  }

  openFilterModal() {
    this.isFilterVisible = true;
  }

  applyFilters() {
    if (!this.minPrice && !this.maxPrice) {
      this.filteredFlights = [...this.originalFlights];
      this.closeFilterModal();
      return;
    }


    this.filteredFlights = this.flights.filter(flight => {
      console.log(flight);
      const flightPrice = flight.total_price.TJS;
      // const flightBaggage = flight.baggage;
      // const flightRefund = flight.refund;
      // const flightTransfers = flight.transfers;
      // const flightTime = flight.departureTime;

      // Фильтрация по стоимости
      // const isPriceInRange = (this.minPrice ? flightPrice >= this.minPrice : true) ||
      //   (this.maxPrice ? flightPrice <= this.maxPrice : true);

      let isPriceInRange = true;

      if (this.minPrice && this.maxPrice) {
        isPriceInRange = flightPrice >= this.minPrice && flightPrice <= this.maxPrice;
      } else if (this.minPrice) {
        isPriceInRange = flightPrice >= this.minPrice;
      } else if (this.maxPrice) {
        isPriceInRange = flightPrice <= this.maxPrice;
      }

      // Фильтрация по багажу
      // const isBaggageMatching = this.selectedBaggage === 'С багажом' ? flightBaggage !== 'Без багажа' : flightBaggage === 'Без багажа';

      // Фильтрация по возврату
      // const isRefundMatching = this.selectedRefund === 'С возвратом' ? flightRefund !== 'Без возврата' : flightRefund === 'Без возврата';

      // Фильтрация по пересадкам
      // const isTransferMatching = flightTransfers === this.selectedTransfer;

      // Фильтрация по времени
      // const flightHour = flightTime.split(':')[0];
      // const isTimeMatching = flightHour >= this.selectedTimeFrom.split(':')[0] && flightHour <= this.selectedTimeTo.split(':')[0];

      // return isPriceInRange && isBaggageMatching && isRefundMatching && isTransferMatching;
      return isPriceInRange;
    });

    this.closeFilterModal();
  }
}
