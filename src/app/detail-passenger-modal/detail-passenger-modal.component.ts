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
  public selectedGender: string = 'male';
  public dropdownOpen: boolean = false;
  public openDropdownPassport: boolean = false;
  public selectedCountry: string = '';
  selectedDate: Date | null = null;
  selectedDocumentExpireDate: Date | null = null;
  public selectedPassportType: string = 'Загран паспорт';
  passports: any[] = [
    {name: 'Загран паспорт', code: 'NP'},
    {name: 'Паспорт РТ', code: 'NP'}
  ];

  passengerData = {
    name: '',
    surname: '',
    middleName: '',
    citizenship: this.selectedCountry,
    gender: this.selectedGender,
    documentType: this.selectedPassportType,
    documentNumber: '',
    birthData: this.selectedDate,
    documentExpireDate: this.selectedDocumentExpireDate
  }

  constructor(private countryService: CountryService, private passengerDataService: PassengerDataService) {
  }

  isValidForm(): string | "" | null | Date {
    return this.passengerData.name &&
      this.passengerData.surname &&
      this.passengerData.middleName &&
      // this.passengerData.citizenship &&
      this.passengerData.gender &&
      this.passengerData.documentNumber &&
      this.passengerData.documentNumber &&
      this.passengerData.birthData &&
      this.passengerData.documentExpireDate;
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    this.passengerData.birthData = this.selectedDate;
    console.log('Выбранная дата:', this.selectedDate);
  }

  onDocumentExpireDate(event: any) {
    this.selectedDocumentExpireDate = event.value;
    this.passengerData.documentExpireDate = event;
  }

  selectGender(gender: string) {
    this.selectedGender = gender;
    this.passengerData.gender = gender;
  }

  selectCountry(countryName: string): void {
    this.selectedCountry = countryName;
    this.dropdownOpen = false;
    this.passengerData.citizenship = countryName;
  }

  selectPassport(passportName: string): void {
    this.selectedPassportType = passportName;
    this.openDropdownPassport = false;
    this.passengerData.documentType = passportName;
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

  closeModal() {
    this.isVisible = false;
  }

  openModal() {
    this.isVisible = true;
  }

  onAnimationEvent(event: AnimationEvent) {
    if (event.phaseName === 'done' && event.toState === 'void') {
      this.isVisible = false;
      this.isAnimating = false;
    }
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  savePassengerData() {
    // if (this.isValidForm()) {
      const cleanedData = this.passengerDataService.cleanPassengerData([this.passengerData]);
      this.passengerDataService.updatePassengerData(cleanedData);
      this.closeModal();
    // }
  }
}
