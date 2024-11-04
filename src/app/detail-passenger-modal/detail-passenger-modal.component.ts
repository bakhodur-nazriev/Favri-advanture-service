import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {animate, AnimationEvent, style, transition, trigger} from "@angular/animations";
import {CountryService} from "../services/country.service";

@Component({
  selector: 'app-detail-passenger-modal',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
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
  public isVisible = false;
  public isAnimating = false;
  countries: any[] = [];

  constructor(private countryService: CountryService) {
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
