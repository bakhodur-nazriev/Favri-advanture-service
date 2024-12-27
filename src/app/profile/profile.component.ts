import {Component} from '@angular/core';
import {NgIf} from "@angular/common";
import {AddPassengerModalComponent} from "../add-passenger-modal/add-passenger-modal.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgIf,
    AddPassengerModalComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  public selectedItem: string = 'passenger';

  selectItem(item: string) {
    this.selectedItem = item;
  }

  addProfile() {
  }
}
