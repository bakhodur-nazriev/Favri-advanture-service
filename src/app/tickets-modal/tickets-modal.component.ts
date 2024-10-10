import {Component} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-tickets-modal',
  standalone: true,
  imports: [
    NgIf,
    NgOptimizedImage
  ],
  templateUrl: './tickets-modal.component.html',
  styleUrl: './tickets-modal.component.scss'
})
export class TicketsModalComponent {
  public isVisible = true;
  public imagePath = 'assets/suppliers/SZ.png';

  closeModal() {
    this.isVisible = false
  }
}
