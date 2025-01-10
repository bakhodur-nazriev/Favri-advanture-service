import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {FormsModule} from "@angular/forms";
import {PassengerDataService} from "../services/passenger-data.service";
import {COUNTRIES} from '../../coutries';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProfileService} from "../services/profile.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-detail-passenger-modal',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    FormsModule,
    JsonPipe,
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
  @Input() passenger: any = {};
  @Output() validationStatusChanged = new EventEmitter<boolean>();

  selectedPassenger: any;

  public isValidationTriggered: boolean = false;
  public isValidationExpirationTriggered: boolean = false;
  public isVisible: boolean = false;
  public isAnimating: boolean = false;
  public dropdownOpen: boolean = false;
  public openDropdownPassport: boolean = false;
  public selectedGender: string = 'M';
  public selectedCountry: string = '';
  public selectedCountryCode: string = '';
  selectedDate: string = '';
  selectedDocumentExpireDate: string = '';
  public selectedPassportType: string = '';
  selectedPassportCode: string | null = null;
  passengerDataList: any[] = [];
  public countries = COUNTRIES;
  public birthDate: string = "";
  selectedIndex: number = 0;
  isGenderDropdownOpen: boolean = false;
  public passports: any[] = [
    {name: 'Загран паспорт', code: 'NP'},
    {name: 'Паспорт РТ', code: 'NP'}
  ];
  public genders: any[] = [
    {text: 'Мужчина', value: 'M',},
    {text: 'Женщина', value: 'F'}
  ];
  walletPhone: string = '';
  profileDataList: any[] = [];

  constructor(
    public passengerDataService: PassengerDataService,
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {
  }

  isValidDate(dateString: string): boolean {
    const regex = /^([0-2]\d|3[0-1])\.(0\d|1[0-2])\.\d{4}$/;
    if (!regex.test(dateString)) return false;

    const [day, month, year] = dateString.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  }

  formatDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);

    if (value.length >= 3) value = value.slice(0, 2) + '.' + value.slice(2);
    if (value.length >= 6) value = value.slice(0, 5) + '.' + value.slice(5);

    input.value = value;
    this.selectedDate = value;
  }

  formatExpirationDateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);

    if (value.length >= 3) value = value.slice(0, 2) + '.' + value.slice(2);
    if (value.length >= 6) value = value.slice(0, 5) + '.' + value.slice(5);

    input.value = value;
    this.selectedDocumentExpireDate = value;
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
      this.selectedPassenger = passenger
      const index = this.passengerDataService.selectedPassengerIndex ?? 0;
      this.selectedIndex = index;

      if (!this.passengerDataList[index]) {
        this.passengerDataList[index] = {
          name: '',
          surname: '',
          middle_name: '',
          type: passenger.passengerType,
          citizenship: this.selectedCountryCode || this.passengerDataList[this.selectedIndex]?.citizenship,
          gender: this.selectedGender || this.passengerDataList[this.selectedIndex]?.gender,
          document_type: this.selectedPassportType || this.passports[0]?.name,
          document_number: '',
          date_of_birth: '',
          expiration_date: '',
          phone: '',
          email: ''
        };
      }
    })

    if (this.passports.length > 0) {
      this.selectedPassportType = this.passports[0].name;
      this.selectedPassportCode = this.passports[0].code;
    }

    const tajikistan = this.countries.find(country => country.name === 'Таджикистан');
    if (tajikistan) {
      this.selectedCountry = tajikistan.name;
      this.selectedCountryCode = tajikistan.code;
    }

    this.route.queryParams.subscribe(params => {
      this.walletPhone = params['walletPhone'] || '';
    });
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
    if (!this.isValidDate(this.passengerDataList[this.selectedIndex].date_of_birth) ||
      !this.isValidDate(this.passengerDataList[this.selectedIndex].expiration_date) ||
      !this.isValidForm()) {
      this.isValidationTriggered = true;
      this.isValidationExpirationTriggered = true;
      return;
    }

    this.checkValidationStatus();

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
    //this.passengerDataService.selectedPassenger.isValidPassenger = true;
    this.selectedPassenger.isValidPassenger = true
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

  isPhoneValid(): boolean {
    const phone = this.passengerDataList[this.selectedIndex]?.phone;
    const normalizedPhone = phone?.startsWith('+992') ? phone.slice(4) : phone;
    return normalizedPhone && normalizedPhone.length === 9 && /^\d+$/.test(normalizedPhone);
  }

  checkValidationStatus(): void {
    if (this.isValidForm()) {
      this.validationStatusChanged.emit(true);
    }
  }

  getAge(birthDate: string): number | null {
    if (!birthDate) return null;

    const birthDateObj = new Date(birthDate);
    if (isNaN(birthDateObj.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    const dayDiff = today.getDate() - birthDateObj.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  getPassengerTypeDisplay(): string {
    const age = this.getAge(this.birthDate);
    if (age === null) return "Пассажир";

    if (age < 2) return "Младенец";
    if (age >= 2 && age <= 12) return "Ребёнок";
    if (age > 12) return "Взрослый";

    return "Пассажир";
  }

  toggleGenderDropdown(): void {
    this.isGenderDropdownOpen = !this.isGenderDropdownOpen;
  }

  getGenderText(genderValue: string): string {
    const gender = this.genders.find(g => g.value === genderValue);
    return gender ? gender.text : 'Не выбран';
  }

  selectPassenger(): void {
    this.profileService.getPassengers(this.walletPhone).subscribe({
      next: (data) => {
        this.profileDataList = data.data;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    })
  }

  protected readonly length = length;
}
