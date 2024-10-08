import {Component, EventEmitter, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {animate, style, transition, trigger, AnimationEvent} from "@angular/animations";

@Component({
  selector: 'app-modal-passengers',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './modal-passengers.component.html',
  styleUrl: './modal-passengers.component.scss',
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

export class ModalPassengersComponent {
  public isVisible = false;
  public isAnimating = false;
  public selectedClass: string = 'Эконом';
  public adults: number = 1;
  public children: number = 0;
  public infants: number = 0

  @Output() selectPassengersAndClass = new EventEmitter<{ passengers: number, travelClass: string }>();

  confirmSelection() {
    this.selectPassengersAndClass.emit({
      passengers: this.adults + this.children + this.infants,
      travelClass: this.selectedClass
    });
    this.closeModal();
  }

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
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

  selectClass(flightClass: string) {
    this.selectedClass = flightClass
  }

  increaseAdults() {
    if (this.adults < 8) {
      this.adults++;
    }
  }

  decreaseAdults() {
    if (this.adults >= 1) {
      this.adults--;
    }
  }

  increaseChildren() {
    if (this.children < 8) {
      this.children++;
    }
  }

  decreaseChildren() {
    if (this.children >= 1) {
      this.children--;
    }
  }

  increaseInfants() {
    if (this.infants < 8) {
      this.infants++;
    }
  }

  decreaseInfants() {
    if (this.infants >= 1) {
      this.infants--;
    }
  }
}
