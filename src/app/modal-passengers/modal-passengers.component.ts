import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";

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
        style({transform: 'translateY(100%)'}),
        animate('300ms ease-in', style({transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateY(100%)'}))
      ])
    ])
  ]
})
export class ModalPassengersComponent {
  public isVisible = false;

  openModal() {
    this.isVisible = true;
  }

  closeModal() {
    this.isVisible = false;
  }
}
