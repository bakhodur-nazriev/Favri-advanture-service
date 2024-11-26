import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {MatInput, MatSuffix} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {FormsModule} from "@angular/forms";
import {PassengerDataService} from "../services/passenger-data.service";
import {COUNTRIES} from '../../coutries';

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

  public isValidationTriggered: boolean = false;
  public isValidationExpirationTriggered: boolean = false;
  public isVisible: boolean = false;
  public isAnimating: boolean = false;
  public dropdownOpen: boolean = false;
  public openDropdownPassport: boolean = false;
  public selectedCountry: string = '';
  public selectedCountryCode: string = '';
  selectedDate: Date | null = null;
  selectedDocumentExpireDate: Date | null = null;
  public selectedPassportType: string = '';
  passports: any[] = [
    {name: 'Загран паспорт', code: 'NP'},
    {name: 'Паспорт РТ', code: 'NP'}
  ];
  selectedPassportCode: string | null = null;
  passengerDataList: any[] = [];
  public countries = COUNTRIES;

  selectedIndex: number = 0

  constructor(public passengerDataService: PassengerDataService) {
  }

  isValidDate(date: string | null): boolean {
    if (!date) return false;
    const datePattern = /^(0[1-9]|1[0-2])\.(0[1-9]|[12][0-9]|3[01])\.\d{4}$/; // мм.дд.гггг
    const [month, day, year] = date?.split('.') || [];

    if (!datePattern.test(date)) return false;

    const parsedDate = new Date(`${year}-${month}-${day}`);
    return (
      parsedDate.getFullYear() === parseInt(year) &&
      parsedDate.getMonth() + 1 === parseInt(month) &&
      parsedDate.getDate() === parseInt(day)
    );
  }

  // formatDateInput(event: Event): void {
  //   const input = (event.target as HTMLInputElement).value;
  //   const cleanedInput = input.replace(/[^0-9]/g, '');
  //   let formattedDate = '';
  //
  //   if (cleanedInput.length > 0) {
  //     formattedDate += cleanedInput.substring(0, 2);
  //     if (cleanedInput.length > 2) {
  //       formattedDate += '.' + cleanedInput.substring(2, 4);
  //     }
  //     if (cleanedInput.length > 4) {
  //       formattedDate += '.' + cleanedInput.substring(4, 8);
  //     }
  //   }
  //
  //   (event.target as HTMLInputElement).value = formattedDate;
  //
  //   this.passengerDataList[this.selectedIndex].date_of_birth = formattedDate;
  //
  //   if (this.isValidDate(formattedDate)) {
  //     this.isValidationTriggered = false;
  //   }
  // }
  //
  // formatExpirationDateInput(event: Event): void {
  //   const input = (event.target as HTMLInputElement).value;
  //   const cleanedInput = input.replace(/[^0-9]/g, '');
  //   let formattedDate = '';
  //
  //   if (cleanedInput.length > 0) {
  //     formattedDate += cleanedInput.substring(0, 2);
  //     if (cleanedInput.length > 2) {
  //       formattedDate += '.' + cleanedInput.substring(2, 4);
  //     }
  //     if (cleanedInput.length > 4) {
  //       formattedDate += '.' + cleanedInput.substring(4, 8);
  //     }
  //   }
  //
  //   (event.target as HTMLInputElement).value = formattedDate;
  //   this.passengerDataList[this.selectedIndex].expiration_date = formattedDate;
  //
  //   if (this.isValidDate(formattedDate)) {
  //     this.isValidationExpirationTriggered = false;
  //   }
  // }

  formatDateInput(event: Event): void {
    this.formatDateField(event, 'date_of_birth');
  }

  formatExpirationDateInput(event: Event): void {
    this.formatDateField(event, 'expiration_date');
  }

  private formatDateField(event: Event, field: 'date_of_birth' | 'expiration_date'): void {
    const input = (event.target as HTMLInputElement).value;
    const cleanedInput = input.replace(/[^0-9]/g, '');
    let formattedDate = '';

    if (cleanedInput.length > 0) {
      formattedDate += cleanedInput.substring(0, 2);
      if (cleanedInput.length > 2) {
        formattedDate += '.' + cleanedInput.substring(2, 4);
      }
      if (cleanedInput.length > 4) {
        formattedDate += '.' + cleanedInput.substring(4, 8);
      }
    }

    (event.target as HTMLInputElement).value = formattedDate;
    this.passengerDataList[this.selectedIndex][field] = formattedDate;

    if (this.isValidDate(formattedDate)) {
      field === 'date_of_birth'
        ? (this.isValidationTriggered = false)
        : (this.isValidationExpirationTriggered = false);
    }
  }

  selectGender(gender: string) {
    this.passengerDataList[this.selectedIndex].gender = gender;
  }

  selectCountry(country: { name: string, code: string }): void {
    this.selectedCountry = country.name;
    this.passengerDataList[this.selectedIndex].citizenship = country.code;
    this.dropdownOpen = false;
  }

  selectPassport(passportName: string, code: string): void {
    this.selectedPassportType = passportName;
    this.selectedPassportCode = code;
    this.openDropdownPassport = false;
    this.passengerDataList[this.selectedIndex].document_type = code;
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
          citizenship: this.selectedCountryCode || this.passengerDataList[this.selectedIndex]?.citizenship,
          gender: this.passengerDataList[this.selectedIndex]?.gender || 'M',
          document_type: this.selectedPassportType || this.passports[0]?.name,
          document_number: '',
          expiration_date: this.selectedDate ? this.toUTCString(this.selectedDate) : null,
          date_of_birth: this.selectedDocumentExpireDate ? this.toUTCString(this.selectedDocumentExpireDate) : null,
          phone: '',
          email: ''
        };
      }
    });

    if (this.passports.length > 0) {
      this.selectedPassportType = this.passports[0].name;
      this.selectedPassportCode = this.passports[0].code;
    }

    const tajikistan = this.countries.find(country => country.name === 'Таджикистан');
    if (tajikistan) {
      this.selectedCountry = tajikistan.name;
      this.selectedCountryCode = tajikistan.code;
    }
  }

  get name(): string {
    return this.passengerDataList[this.selectedIndex]?.name || '';
  }

  set name(value: string) {
    if (this.isLatin(value)) {
      this.passengerDataList[this.selectedIndex].name = value.toUpperCase();
    } else {
      this.passengerDataList[this.selectedIndex].name = '';
    }
  }

  get surname(): string {
    return this.passengerDataList[this.selectedIndex]?.surname || '';
  }

  set surname(value: string) {
    if (this.isLatin(value)) {
      this.passengerDataList[this.selectedIndex].surname = value.toUpperCase();
    } else {
      this.passengerDataList[this.selectedIndex].surname = '';
    }
  }

  get middleName(): string {
    return this.passengerDataList[this.selectedIndex]?.middle_name || '';
  }

  set middleName(value: string) {
    if (this.isLatin(value)) {
      this.passengerDataList[this.selectedIndex].middle_name = value.toUpperCase();
    } else {
      this.passengerDataList[this.selectedIndex].middle_name = '';
    }
  }

  savePassengerData() {
    if (!this.isValidForm()) {
      this.isValidationTriggered = true;
      this.isValidationExpirationTriggered = true;

      return;
    }

    const currentPassenger = this.passengerDataList[this.selectedIndex];

    if (this.selectedDate) {
      currentPassenger.date_of_birth = new Date(this.selectedDate).toISOString();
    } else {
      currentPassenger.date_of_birth = null;
    }

    if (this.selectedDocumentExpireDate) {
      currentPassenger.expiration_date = new Date(this.selectedDocumentExpireDate).toISOString();
    } else {
      currentPassenger.expiration_date = null;
    }

    if (this.passengerDataService.selectedPassengerIndex != null) {
      if (!this.passengerDataList[this.passengerDataService.selectedPassengerIndex].phone.startsWith('+992')) {
        this.passengerDataList[this.passengerDataService.selectedPassengerIndex].phone = `+992${this.passengerDataList[this.passengerDataService.selectedPassengerIndex].phone}`;
      }

      this.passengerDataList[this.passengerDataService.selectedPassengerIndex] = {
        ...this.passengerDataList[this.passengerDataService.selectedPassengerIndex],
        document_type: this.selectedPassportCode,
        citizenship: this.selectedCountryCode,
      }
    }

    this.passengerDataService.setPassengersDataList(this.passengerDataList);

    this.closeModal();
  }

  isLatin(value: string): boolean {
    const latinRegex = /^[a-zA-Z]+$/
    return latinRegex.test(value);
  }

  isValidForm(): boolean {
    const currentPassenger = this.passengerDataList[this.selectedIndex]

    if (!currentPassenger) return false;

    const isNameValid = currentPassenger.name && this.isLatin(currentPassenger.name);
    const isSurnameValid = currentPassenger.surname && this.isLatin(currentPassenger.surname);

    return (
      isNameValid &&
      isSurnameValid &&
      currentPassenger.citizenship &&
      currentPassenger.gender &&
      currentPassenger.document_type &&
      currentPassenger.document_number &&
      currentPassenger.expiration_date &&
      currentPassenger.date_of_birth &&
      currentPassenger.phone &&
      currentPassenger.email
    )
  }

  toUTCString(date: Date): string {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}T${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}Z`;
  }
}
