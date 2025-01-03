import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {COUNTRIES} from "../../coutries";
import {ProfileService} from "../services/profile.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-add-passenger-modal',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgForOf
  ],
  templateUrl: './add-passenger-modal.component.html',
  styleUrl: './add-passenger-modal.component.scss'
})
export class AddPassengerModalComponent implements OnInit {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() passengerAddedEvent = new EventEmitter<void>();

  public walletPhone: string = "";
  public firstName: string = "";
  public surName: string = "";
  public middleName: string = "";
  public citizenShip: string = "";
  public gender: string = "";
  public type: string = "";
  public documentType: string = "";
  public documentNumber: string = "";
  public email: string = "";
  public phone: string = "";
  public birthDate: string = "";
  public expirationDate: string = "";
  public issueDate: string = "";

  public isValidationTriggered: boolean = false;
  public isGenderDropdownOpen: boolean = false;
  public isPassportDropdownOpen: boolean = false;
  public isCitizenshipDropdownOpen: boolean = false;
  public selectedGender: string = '';
  public selectedCountry: string = '';
  public selectedPassportType: string = '';
  public selectedPassportCode: string | null = null;
  public passports: any[] = [
    {name: 'Загран паспорт', code: 'NP'},
    {name: 'Паспорт РТ', code: 'NP'}
  ];
  public genders: any[] = [
    {text: 'Мужчина', value: 'M',},
    {text: 'Женщина', value: 'F'}
  ]

  protected readonly countries = COUNTRIES;

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.walletPhone = params['walletPhone'] || '';
    });
  }

  closeModal() {
    this.closeModalEvent.emit();
  }

  toggleGenderDropdown(): void {
    this.isGenderDropdownOpen = !this.isGenderDropdownOpen;
  }

  togglePassportDropdown(): void {
    this.isPassportDropdownOpen = !this.isPassportDropdownOpen;
  }

  getGenderText(genderValue: string): string {
    const gender = this.genders.find(g => g.value === genderValue);
    return gender ? gender.text : 'Не выбран';
  }

  selectGender(genderValue: string) {
    this.selectedGender = genderValue;
    this.gender = genderValue;
    this.isGenderDropdownOpen = false;
  }

  selectPassport(passportName: string, code: string): void {
    this.selectedPassportType = passportName;
    this.selectedPassportCode = code;
    this.documentType = code;
    this.isPassportDropdownOpen = false;
  }


  addPassenger() {
    if (!this.phone.startsWith('+992')) {
      this.phone = `+992${this.phone}`;
    }

    const passenger = {
      firstName: this.firstName,
      surName: this.surName,
      middleName: this.middleName,
      citizenShip: this.citizenShip,
      gender: this.gender,
      type: this.getPassengerTypeCode(),
      documentType: this.documentType,
      documentNumber: this.documentNumber,
      email: this.email,
      phone: this.phone,
      birthDate: this.birthDate,
      expirationDate: this.expirationDate,
      passportIssueDate: this.issueDate,
      walletPhone: this.walletPhone
    }

    this.profileService.addPassenger(passenger).subscribe({
      next: (res) => {
        this.passengerAddedEvent.emit();
        this.closeModal();
        this.resetForm();
      },
      error: (err) => {
        console.error('Ошибка при добавлении пассажира', err);
      }
    })
  }

  resetForm() {
    this.firstName = '';
    this.surName = '';
    this.middleName = '';
    this.citizenShip = '';
    this.gender = '';
    this.type = '';
    this.documentType = '';
    this.documentNumber = '';
    this.email = '';
    this.phone = '';
    this.birthDate = '';
    this.expirationDate = '';
    this.issueDate = '';
  }

  toggleCitizenship() {
    this.isCitizenshipDropdownOpen = !this.isCitizenshipDropdownOpen;
  }

  selectCountry(country: { name: string, code: string }): void {
    this.selectedCountry = country.name;
    this.citizenShip = country.code;
    this.isCitizenshipDropdownOpen = false;
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

  getPassengerTypeCode(): string {
    const age = this.getAge(this.birthDate);
    if (age === null) return "";

    if (age < 2) return "ins";
    if (age >= 2 && age <= 12) return "chd";
    if (age > 12) return "adt";

    return "";
  }
}
