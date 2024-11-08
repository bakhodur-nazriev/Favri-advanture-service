import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {DetailPassengerModalComponent} from "../detail-passenger-modal/detail-passenger-modal.component";

@Component({
  selector: 'app-order-ticket-modal',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage
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
export class OrderTicketModalComponent {
  @Input() flight!: any;
  @Output() detailPassengerSelected = new EventEmitter<any>;

  public isVisible = false;
  public isAnimating = false;

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

  openDetailPassengerModal() {
    this.detailPassengerSelected.emit();
  }
}
