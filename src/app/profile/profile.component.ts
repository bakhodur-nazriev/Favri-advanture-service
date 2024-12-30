import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {AddPassengerModalComponent} from "../add-passenger-modal/add-passenger-modal.component";
import {ProfileService} from "../services/profile.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgIf,
    AddPassengerModalComponent,
    NgForOf
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public selectedItem: string = 'passenger';
  public isVisible: boolean = false;
  openDropdownPassport: boolean = false;
  selectedIndex: number = 0;
  selectedPassportType: string = '';
  profileDataList: any[] = [];
  walletPhone: string = '+992937454571';

  constructor(private profileService: ProfileService) {
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileService.getPassengers(this.walletPhone).subscribe({
      next: (data) => {
        console.log(data.data);
        this.profileDataList = data.data;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    })
  }

  selectItem(item: string) {
    this.selectedItem = item;
  }

  addProfile() {
  }

  togglePassengerDropdown() {
  }

  selectPassport(name: string, code: string): void {
    this.selectedPassportType = name;
    this.openDropdownPassport = false;
  }
}
