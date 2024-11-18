import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {CountryService} from "../services/country.service";
import {MatInput, MatSuffix} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {FormsModule} from "@angular/forms";
import {PassengerDataService} from "../services/passenger-data.service";

@Component({
  selector: 'app-detail-passenger-modal',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatInput,
    MatSuffix,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    FormsModule
  ],
  templateUrl: './detail-passenger-modal.component.html',
  styleUrl: './detail-passenger-modal.component.scss',
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
export class DetailPassengerModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() passenger: any;

  public isVisible: boolean = false;
  public isAnimating: boolean = false;
  countries: any[] = [];
  public selectedGender: string = '';
  public dropdownOpen: boolean = false;
  public openDropdownPassport: boolean = false;
  public selectedCountry: string = '';
  selectedDate: Date | null = null;
  selectedDocumentExpireDate: Date | null = null;
  public selectedPassportType: string = '';
  passports: any[] = [
    {name: 'Загран паспорт', code: 'NP'},
    {name: 'Паспорт РТ', code: 'NP'}
  ];
  passengerDataList: any[] = [];

  selectedIndex: number = 0

  constructor(private countryService: CountryService, public passengerDataService: PassengerDataService) {
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    this.passengerDataList[this.selectedIndex].birthDate = this.selectedDate ? new Date(this.selectedDate).toISOString() : null;
  }

  onDocumentExpireDate(event: any) {
    this.selectedDocumentExpireDate = event.value;
    this.passengerDataList[this.selectedIndex].documentExpireDate = this.selectedDocumentExpireDate ? new Date(this.selectedDocumentExpireDate).toISOString() : null;
  }

  selectGender(gender: string) {
    this.selectedGender = gender;
    this.passengerDataList[this.selectedIndex].gender = gender;
  }

  selectCountry(countryName: string): void {
    this.selectedCountry = countryName;
    this.dropdownOpen = false;
    this.passengerDataList[this.selectedIndex].citizenship = countryName;
  }

  selectPassport(passportName: string): void {
    this.selectedPassportType = passportName;
    this.openDropdownPassport = false;
    this.passengerDataList[this.selectedIndex].documentType = passportName;
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe(
      (data) => {
        this.countries = data.map((country: any) => ({
          name: country.name.common,
          flag: country.flags.svg
        }));
      },
      (error) => {
        console.error('Ошибка при загрузке списка стран:', error);
      }
    );
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  togglePassportDropdown(): void {
    this.openDropdownPassport = !this.openDropdownPassport;
  }

  onAnimationEvent(event: AnimationEvent) {
    if (event.phaseName === 'done' && event.toState === 'void') {
      this.isVisible = false;
      this.isAnimating = false;
    }
  }

  closeModal() {
    this.isVisible = false;
  }

  openModal() {
    this.isVisible = true;
  }

  ngOnInit(): void {
    this.passengerDataService.event$.subscribe((message) => {
      const index = this.passengerDataService.selectedPassengerIndex ?? 0;
      this.selectedIndex = index;

      if (!this.passengerDataList[index]) {
        this.passengerDataList[index] = {
          name: '',
          surname: '',
          middleName: '',
          citizenship: this.selectedCountry ? this.passengerDataList[this.selectedIndex]?.citizenship : this.selectedCountry,
          gender: this.selectedGender ? this.passengerDataList[this.selectedIndex]?.gender : this.selectedGender,
          documentType: this.selectedPassportType ? this.passengerDataList[this.selectedIndex]?.documentType : this.selectedPassportType,
          documentNumber: '',
          birthDate: this.selectedDate ? new Date(this.selectedDate).toISOString() : null,
          documentExpireDate: this.selectedDocumentExpireDate ? new Date(this.selectedDocumentExpireDate).toISOString() : null,
        };
      }
    });

    this.loadCountries();
  }

  savePassengerData() {
    if (this.passengerDataService.selectedPassengerIndex != null) {
      this.passengerDataList[this.passengerDataService.selectedPassengerIndex] = {
        ...this.passengerDataList[this.passengerDataService.selectedPassengerIndex],
      }
    }

    this.passengerDataService.setPassengersDataList(this.passengerDataList);

    this.closeModal();
  }
}
