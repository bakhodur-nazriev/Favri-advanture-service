import {Component} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-modal-order-succeed',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './modal-order-succeed.component.html',
  styleUrl: './modal-order-succeed.component.scss'
})
export class ModalOrderSucceedComponent {
  public isVisible: boolean = false;

  backToHome() {
    this.isVisible = false;
  }
}
