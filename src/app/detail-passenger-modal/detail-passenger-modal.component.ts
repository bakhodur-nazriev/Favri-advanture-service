import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {CountryService} from "../services/country.service";
import {MatInput, MatSuffix} from "@angular/material/input";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";

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
    MatDatepickerInput
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

  constructor(private countryService: CountryService) {
  }

  onDateChange(event: any) {
    this.selectedDate = event.value;
    console.log('Выбранная дата:', this.selectedDate);
  }

  onDocumentExpireDate(event: any) {
    this.selectedDocumentExpireDate = event.value;
  }

  selectGender(gender: string) {
    this.selectedGender = gender;
  }

  loadCountries(): void {
    this.countryService.getCountries().subscribe(
      (data) => {
        this.countries = data.map((country: any) => ({
          name: country.name.common,
          code: country.cca2
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

  selectCountry(countryName: string): void {
    this.selectedCountry = countryName;
    this.dropdownOpen = false;
  }

  selectPassport(passportName: string): void {
    this.selectedPassportType = passportName;
    this.openDropdownPassport = false;
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
    this.loadCountries()
  }
}
