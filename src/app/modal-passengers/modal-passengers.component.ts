import {Component} from '@angular/core';
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
}
