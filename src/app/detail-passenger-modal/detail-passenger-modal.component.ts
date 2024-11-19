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
  selectedPassportCode: string | null = null;
  passengerDataList: any[] = [];

  selectedIndex: number = 0

  constructor(private countryService: CountryService, public passengerDataService: PassengerDataService) {
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    this.passengerDataList[this.selectedIndex].date_of_birth = this.selectedDate ? new Date(this.selectedDate).toISOString() : null;
  }

  onDocumentExpireDate(event: any) {
    this.selectedDocumentExpireDate = event.value;
    this.passengerDataList[this.selectedIndex].expiration_date = this.selectedDocumentExpireDate ? new Date(this.selectedDocumentExpireDate).toISOString() : null;
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

  selectPassport(passportName: string, code: string): void {
    this.selectedPassportType = passportName;
    this.selectedPassportCode = code;
    this.openDropdownPassport = false;
    this.passengerDataList[this.selectedIndex].document_type = code;
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe(
      (data) => {
        this.countries = data.map((country: any) => ({
          name: country.cca2,
          flag: country.flags.svg
        }));

        const tajikistan = this.countries.find(country => country.name === 'Tajikistan');
        if (tajikistan) {
          this.selectedCountry = tajikistan.name;
        }
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
    this.passengerDataService.event$.subscribe((passenger: any) => {
      const index = this.passengerDataService.selectedPassengerIndex ?? 0;
      this.selectedIndex = index;
      if (!this.passengerDataList[index]) {
        this.passengerDataList[index] = {
          name: '',
          surname: '',
          middle_name: '',
          type: passenger.passengerType,
          citizenship: this.selectedCountry || this.passengerDataList[this.selectedIndex]?.citizenship,
          gender: this.selectedGender ? this.passengerDataList[this.selectedIndex]?.gender : this.selectedGender,
          document_type: this.selectedPassportType || this.passports[0]?.name,
          document_number: '',
          expiration_date: this.selectedDate ? new Date(this.selectedDate).toISOString() : null,
          date_of_birth: this.selectedDocumentExpireDate ? new Date(this.selectedDocumentExpireDate).toISOString() : null,
          phone: '',
          email: ''
        };
      }
    });

    if (this.passports.length > 0) {
      this.selectedPassportType = this.passports[0].name;
      this.selectedPassportCode = this.passports[0].code;
    }

    this.loadCountries();
  }

  get name(): string {
    return this.passengerDataList[this.selectedIndex]?.name || '';
  }

  set name(value: string) {
    this.passengerDataList[this.selectedIndex].name = value.toUpperCase();
  }

  get surname(): string {
    return this.passengerDataList[this.selectedIndex]?.surname || '';
  }

  set surname(value: string) {
    this.passengerDataList[this.selectedIndex].surname = value.toUpperCase();
  }

  get middleName(): string {
    return this.passengerDataList[this.selectedIndex]?.middle_name || '';
  }

  set middleName(value: string) {
    this.passengerDataList[this.selectedIndex].middle_name = value.toUpperCase();
  }

  savePassengerData() {
    if (this.passengerDataService.selectedPassengerIndex != null) {
      this.passengerDataList[this.passengerDataService.selectedPassengerIndex] = {
        ...this.passengerDataList[this.passengerDataService.selectedPassengerIndex],
        document_type: this.selectedPassportCode
      }
    }

    this.passengerDataService.setPassengersDataList(this.passengerDataList);

    this.closeModal();
  }
}
