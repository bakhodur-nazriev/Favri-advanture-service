import {Component, EventEmitter, Input, Output, OnInit, HostListener, SimpleChanges, OnChanges} from '@angular/core';
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
export class TicketsModalComponent implements OnChanges {
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
  public selectedRefund: string = '';
  public selectedChange: string = '';
  public selectedTransfer: string = '';
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['flights']) {
      this.originalFlights = [...this.flights];
      this.filteredFlights = [...this.flights];
    }
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

  getTransferCount(segments: any[]): number {
    return segments.length - 1;
  }

  applyFilters() {
    if (!this.minPrice && !this.maxPrice) {
      this.filteredFlights = [...this.originalFlights];
      this.closeFilterModal();
      return;
    }


    this.filteredFlights = this.originalFlights.filter(flight => {
      const flightPrice = flight?.total_price?.TJS;
      const flightRefund = flight?.routes?.[0]?.segments?.[0]?.is_refund;
      const flightExchange = flight?.routes?.[0]?.segments?.[0]?.is_change;
      const flightTransfers = flight?.routes?.[0]?.segments || [];
      const transferCount = this.getTransferCount(flightTransfers);

      if (flightPrice === undefined) {
        return false;
      }

      let isPriceInRange = true;
      if (this.minPrice && this.maxPrice) {
        isPriceInRange = flightPrice >= this.minPrice && flightPrice <= this.maxPrice;
      } else if (this.minPrice) {
        isPriceInRange = flightPrice >= this.minPrice;
      } else if (this.maxPrice) {
        isPriceInRange = flightPrice <= this.maxPrice;
      }

      let isRefundMatch = true;
      if (this.selectedRefund === 'С возвратом') {
        isRefundMatch = flightRefund === true;
      } else if (this.selectedRefund === 'Без возврата') {
        isRefundMatch = flightRefund === false;
      }

      let isChangeMatch = true;
      if (this.selectedChange === 'С обменом') {
        isChangeMatch = flightExchange === true;
      } else if (this.selectedChange === 'Без обмена') {
        isChangeMatch = flightExchange === false;
      }

      let isTransferMatch = true;
      if (this.selectedTransfer === '1 пересадка') {
        isTransferMatch = transferCount === 1;
      } else if (this.selectedTransfer === '2 пересадки') {
        isTransferMatch = transferCount === 2;
      } else if (this.selectedTransfer === '3 пересадки') {
        isTransferMatch = transferCount === 3;
      }
      console.log(transferCount);

      // const flightHour = flightTime.split(':')[0];
      // const isTimeMatching = flightHour >= this.selectedTimeFrom.split(':')[0] && flightHour <= this.selectedTimeTo.split(':')[0];

      return isPriceInRange && isRefundMatch && isChangeMatch && isTransferMatch;
    });
    this.closeFilterModal();
  }

  toggleChange(changeType: string): void {
    this.selectedChange = this.selectedChange === changeType ? '' : changeType;
  }

  toggleRefund(changeType: string): void {
    this.selectedRefund = this.selectedRefund === changeType ? '' : changeType;
  }

  toggleTransfer(changeType: string): void {
    this.selectedTransfer = this.selectedTransfer === changeType ? '' : changeType;
  }
}
