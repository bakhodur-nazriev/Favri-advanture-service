import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {COUNTRIES} from "../../coutries";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-edit-passenger-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './edit-passenger-modal.component.html',
  styleUrl: './edit-passenger-modal.component.scss'
})
export class EditPassengerModalComponent implements OnChanges {
  @Output() closeModalEvent = new EventEmitter<void>();

  @Input() passenger: any = {};

  protected readonly countries = COUNTRIES;

  isGenderDropdownOpen: boolean = false;
  isPassportDropdownOpen: boolean = false;
  public genders: any[] = [
    {text: 'Мужчина', value: 'M'},
    {text: 'Женщина', value: 'F'}
  ];
  public passports: any[] = [
    {text: 'Загран паспорт', value: 'NP'},
    {text: 'Паспорт РТ', value: 'NP'}
  ];

  closeModal() {
    this.closeModalEvent.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['passenger']) {
      console.log('Updated passenger:', this.passenger);
    }
  }

  toggleGenderDropdown() {
    this.isGenderDropdownOpen = !this.isGenderDropdownOpen;
  }

  selectGender(genderValue: string) {
    this.passenger.gender = genderValue;
    this.isGenderDropdownOpen = false;
  }

  getGenderText(genderValue: string): string {
    const gender = this.genders.find(g => g.value === genderValue);
    return gender ? gender.text : 'Не выбран';
  }

  togglePassportDropdown() {
    this.isPassportDropdownOpen = !this.isPassportDropdownOpen;
  }

  getPassportText(passportValue: string): string {
    const passport = this.passports.find(p => p.value === passportValue);
    return passport ? passport.text : 'Не выбран';
  }

  selectPassport(passportValue: string) {
    this.passenger.documentType = passportValue;
    this.isPassportDropdownOpen = false;
  }
}
