import {Component, Input} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-preorder-modal',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgIf
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
  public isVisible = false;
  public isAnimating = false;
  @Input() flight!: any;
  public selectedFlight: any;

  openModal(flight: any) {
    this.selectedFlight = flight;
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

  // getBaggageInKG(baggageWeight: string): string {
  // }
}
