import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {AnimationEvent} from "@angular/animations";
import {CityService} from "../services/city-service.service";
import {debounceTime, switchMap, catchError} from 'rxjs/operators';
import {of} from "rxjs";

@Component({
  selector: 'app-direction-from-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './direction-from-modal.component.html',
  styleUrl: './direction-from-modal.component.scss'
})

export class DirectionFromModalComponent {
  public directionsCity = [
    {
      city: 'Душанбе',
      country: 'Таджикистан',
      airportCode: 'DYU'
    },
    {
      city: 'Душанбе',
      airportCode: 'DYU'
    },
    {
      city: 'Куляб',
      airportCode: 'TJU'
    },
    {
      city: 'Худжанд',
      airportCode: 'LBD'
    },
    {
      city: 'Бохтар',
      airportCode: 'KQT'
    },
    {
      city: 'Москва',
      country: 'Российская Федерация (Россия)',
      airportCode: 'MOW'
    },
    {
      city: 'Быково',
      airportCode: 'BKA'
    },
    {
      city: 'Шереметьево',
      airportCode: 'SVO'
    },
    {
      city: 'Внуково',
      airportCode: 'VKO'
    },
    {
      city: 'Домодедово',
      airportCode: 'DME'
    },
    {
      city: 'Жуковсикй',
      airportCode: 'ZIA'
    },
    {
      city: 'Алматы',
      country: 'Казахстан',
      airportCode: 'ALA',
    },
    {
      city: 'Алматы',
      airportCode: 'ALA'
    },
    {
      city: 'Стамбул',
      country: 'Тугрция',
      airportCode: 'IST',
    },
    {
      city: 'Стамбул',
      airportCode: 'Турция'
    },
    {
      city: 'Дубай',
      country: 'Объединенные Арабские Эмираты',
      airportCode: 'DXB',
    },
    {
      city: 'Дубай',
      airportCode: 'DXB'
    },
  ]
  public filteredDirections = [...this.directionsCity];
  public searchTerm = '';
  public isVisible = true;
  public isAnimating = false;
  public isLoading = false;

  @Output() selectDirection = new EventEmitter<any>();
  @ViewChild('searchFromInput') searchFromInput!: ElementRef;
  searchInput: any;

  constructor(private cityService: CityService) {
  }

  onSearchChange() {
    const searchTermTrimmed = this.searchTerm.trim();

    if (searchTermTrimmed.length > 0) {
      this.isLoading = true;
      this.cityService.searchCities(searchTermTrimmed).subscribe({
        next: (res) => {
          this.filteredDirections = res.data.map((item: any) => ({
            city: item.item.ru || item.item.en || item.item.tj || item.item.uz,
            airportCode: item.item_code,
            country: item.country.ru || item.country.en || item.country.tj || item.country.uz,
          }));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Ошибка при поиске городов:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.filteredDirections = [...this.directionsCity];
      this.isLoading = false;
    }
  }

  chooseDirection(direction: any) {
    this.selectDirection.emit(direction);
    this.closeModal();
  }

  resetSearch() {
    this.searchTerm = '';
    this.filteredDirections = [...this.directionsCity];
    this.isLoading = false
  }

  openModal() {
    this.isVisible = true;
    this.isAnimating = false;

    setTimeout(() => {
      this.searchInput = document.getElementById('searchFromInput');
      (this.searchInput as HTMLInputElement).focus();
    }, 100)
  }

  closeModal() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.isVisible = false;
    }
  }

  onAnimationEvent(event: AnimationEvent) {
    if (event.phaseName === 'done' && event.toState === 'void') {
      this.isVisible = false;
      this.isAnimating = false;
    }
  }
}
