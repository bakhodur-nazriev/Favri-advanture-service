import {Component, EventEmitter, Input, Output, OnInit, HostListener, ViewChild} from '@angular/core';
import {JsonPipe, KeyValuePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {FilterTicketsComponent} from "../filter-tickets/filter-tickets.component";

@Component({
  selector: 'app-tickets-modal',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    NgForOf,
    KeyValuePipe,
    JsonPipe,
    FilterTicketsComponent,
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
  @ViewChild('filterTickets') filterTickets!: FilterTicketsComponent

  isVisible: boolean = false;
  departureAirport: any;
  arrivalAirport: any;
  flightDuration: string = '';
  public isBookingInfoModal: boolean = false;
  public isModalBookingVisible: boolean = true;
  currentFilter: string = 'all';

  constructor() {
    this.initializeFlightData();
  }

  routes: any[] = [
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

  selectFlight(flight: any) {
    console.log(flight);
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

  closeModalBooking() {
    const ticketModalBlock = document.querySelector('.tickets-modal__block');
    if (ticketModalBlock) {
      ticketModalBlock.classList.add('overflow-hidden');
      ticketModalBlock.classList.add('h-100');
    }

    this.isModalBookingVisible = false;
  }

  getFilteredFlights(): any[] {
    if (this.currentFilter === 'direct') {
      return this.flights.filter(flight => flight.routes[0].segments.length === 1);
    } else if (this.currentFilter === 'oneStop') {
      return this.flights.filter(flight => flight.routes[0].segments.length === 2);
    } else if (this.currentFilter === 'multipleStops') {
      return this.flights.filter(flight => flight.routes[0].segments.length > 2);
    }
    return this.flights;
  }

  openFilterModal() {
    if (this.filterTickets) {
      this.filterTickets.openModal();
    } else {
      console.error('FilterTicketsComponent не найден');
    }
  }
}
