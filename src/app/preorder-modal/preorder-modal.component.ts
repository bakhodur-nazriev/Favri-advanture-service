import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {Included} from "../models/flights-included.interface";

@Component({
  selector: 'app-preorder-modal',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf,
    NgForOf
  ],
  templateUrl: './preorder-modal.component.html',
  styleUrl: './preorder-modal.component.scss',
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
export class PreorderModalComponent {
  @Input() flight!: any;
  @Input() included!: Included | undefined;
  @Input() fromCity!: string;
  @Input() toCity!: string;
  @Output() flightSelected = new EventEmitter<any>();

  public isVisible = false;
  public isAnimating = false;
  public selectedFlight: any;

  selectFlight(flight: any) {
    const modalBlock = document.querySelector('.tickets-modal__block') as HTMLElement;
    if (modalBlock) {
      modalBlock.style.display = 'none';
    }
    this.flightSelected.emit(flight);
    sessionStorage.setItem('amountSelectedFlight', flight.value.total_price.TJS);
  }

  openModal(flight: any) {
    this.selectedFlight = flight;
    this.isVisible = true;
  }

  closeModal() {
    const ticketModalBlock = document.querySelector('.tickets-modal__block');
    if (ticketModalBlock) {
      ticketModalBlock.classList.remove('overflow-hidden');
    }
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.isVisible = false;
    }
  }

  onAnimationEvent(event: AnimationEvent) {
    if (event.phaseName === 'done' && event.toState === 'void') {
      this.isVisible = false;
      this.isAnimating = false;
    }
  }

  convertDuration(duration: number): string {
    const hours = Math.floor(duration / 3600);
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

  getServiceClassInCyrillic(serviceClassName: string): string {
    switch (serviceClassName.toLowerCase()) {
      case 'economy':
        return 'Эконом';
      case 'business':
        return 'Бизнес';
      case 'first':
        return 'Первый';
      default:
        return serviceClassName;
    }
  }

  formatDate(dateString: string): string {
    const [day, month, year] = dateString.split(" ")[0].split(".");
    const date = new Date(+year, +month - 1, +day);
    return date.toLocaleDateString("ru-RU", {day: 'numeric', month: 'long'});
  }

  getCityName(iataCode: any): any | null {
    if (!this.included || !this.included?.city) {
      console.warn("Данные города не загружены.");
      return iataCode;
    }
    const city = this.included?.city[iataCode];
    return city ? city.name.ru : iataCode;
  }

  getAirportName(iataCode: string): string | null {
    if (!this.included || !this.included?.airport) {
      console.warn("Данные аэропорта не загружены.");
      return iataCode;
    }
    const airport = this.included?.airport[iataCode];
    return airport ? airport.name.ru : iataCode;
  }
}
