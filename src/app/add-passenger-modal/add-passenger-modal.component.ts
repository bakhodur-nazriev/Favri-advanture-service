import {Component} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {COUNTRIES} from "../../coutries";

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
export class AddPassengerModalComponent {
  public name: string = '';
  public surname: string = '';
  public isValidationTriggered: boolean = false;
  public dropdownOpen: boolean = false;
  public openGenderPassport: boolean = false;
  public openDropdownPassport: boolean = false;
  public selectedGender: string = 'M';
  public selectedCountry: string = '';
  public selectedPassportType: string = '';
  public selectedPassportCode: string | null = null;
  public passengerDataList: any[] = [];
  selectedIndex: number = 0;
  public passports: any[] = [
    {name: 'Загран паспорт', code: 'NP'},
    {name: 'Паспорт РТ', code: 'NP'}
  ];
  public genders: any[] = [
    {text: 'Мужчина', value: 'M',},
    {text: 'Женщина', value: 'F'}
  ]

  protected readonly countries = COUNTRIES;

  closeModal() {

  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleGenderDropdown(): void {
    this.openGenderPassport = !this.openGenderPassport;
  }

  togglePassportDropdown(): void {
    this.openDropdownPassport = !this.openDropdownPassport;
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
}
