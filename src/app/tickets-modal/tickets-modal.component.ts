import {Component, EventEmitter, Input, Output} from '@angular/core';
import {JsonPipe, KeyValuePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-tickets-modal',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage,
    NgForOf,
    KeyValuePipe,
    JsonPipe
  ],
  templateUrl: './tickets-modal.component.html',
  styleUrl: './tickets-modal.component.scss'
})
export class TicketsModalComponent {
  public isVisible = false;
  departureAirport: any;
  arrivalAirport: any;
  flightDuration: string = '';

  constructor() {
    this.initializeFlightData();
  }

  @Input() flights: any[] = ['flights'];
  @Input() fromCity!: string;
  @Input() toCity!: string;
  @Input() isLoading!: boolean;
  @Output() flightSelected = new EventEmitter<any>();

  selectFlight(flight: any) {
    console.log('Выбор рейса в TicketsModalComponent:', flight);
    this.flightSelected.emit(flight);
  }

  openModal() {
    this.isVisible = true;
  }
  closeModal() {
    this.isVisible = false
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
}
