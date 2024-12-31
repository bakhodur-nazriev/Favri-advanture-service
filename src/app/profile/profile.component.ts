import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {AddPassengerModalComponent} from "../add-passenger-modal/add-passenger-modal.component";
import {ProfileService} from "../services/profile.service";
import {EditPassengerModalComponent} from "../edit-passenger-modal/edit-passenger-modal.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    NgIf,
    AddPassengerModalComponent,
    NgForOf,
    EditPassengerModalComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();

  public selectedTab: string = 'passenger';
  public isVisible: boolean = false;
  openDropdownPassport: boolean = false;
  selectedIndex: number = 0;
  selectedPassportType: string = '';
  profileDataList: any[] = [];
  walletPhone: string = '+992937454571';
  showEditPassengerModal: boolean = false;
  showAddPassengerModal: boolean = false;
  passenger = {};

  constructor(private profileService: ProfileService) {
  }

  closeModal() {
    this.closeModalEvent.emit();
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
    this.selectedTab = item;
  }

  togglePassengerDropdown() {
  }

  selectPassport(name: string, code: string): void {
    this.selectedPassportType = name;
    this.openDropdownPassport = false;
  }

  addPassengerModal() {
    this.showAddPassengerModal = true;
  }

  closeAddPassengerModal(){
    this.showAddPassengerModal = false;
  }

  openEditPassengerModal(passenger: any): void {
    this.passenger = passenger;
    this.showEditPassengerModal = true;
  }

  closeEditPassengerModal(): void {
    this.showEditPassengerModal = false;
  }
}
