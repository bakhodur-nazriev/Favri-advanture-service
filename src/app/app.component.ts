import {Component, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CustomInputComponent} from "./custom-input/custom-input.component";
import {NgOptimizedImage} from "@angular/common";
import {ModalPassengersComponent} from "./modal-passengers/modal-passengers.component";
import {DatepickerModalComponent} from "./datepicker-modal/datepicker-modal.component";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {DirectionFromModalComponent} from './direction-from-modal/direction-from-modal.component'
import {DirectionToModalComponent} from "./direction-to-modal/direction-to-modal.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CustomInputComponent,
    NgOptimizedImage,
    ModalPassengersComponent,
    DatepickerModalComponent,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    DirectionFromModalComponent,
    DirectionToModalComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Favri-advanture-service';
  public from = '';
  public to = '';
  public fromPlaceholder: string = 'Откуда';
  public toPlaceholder: string = 'Куда';
  public totalPassengers: number = 1;
  public travelClass: string = 'Эконом';
  public selectedDateText: string = 'Сегодня'

  @ViewChild('directionFromModalComponent') directionFromModalComponent!: DirectionFromModalComponent;
  @ViewChild('directionToModalComponent') directionToModalComponent!: DirectionToModalComponent;
  @ViewChild('modalPassengers') modalPassengers!: ModalPassengersComponent;
  @ViewChild('datepickerModalComponent') datepickerModalComponent!: DatepickerModalComponent;

  handlePassengersAndClass(data: { passengers: number, travelClass: string }) {
    this.totalPassengers = data.passengers;
    this.travelClass = data.travelClass;

    console.log('Количество пассажиров:', this.totalPassengers);
    console.log('Класс перелета:', this.travelClass);
  }

  openDirectionFromModal() {
    this.directionFromModalComponent.openModal();
  }

  openDirectionToModal() {
    this.directionToModalComponent.openModal();
  }

  swapLocations() {
    const temp = this.from;
    this.from = this.to;
    this.to = temp;

    const tempPlaceholder = this.fromPlaceholder;
    this.fromPlaceholder = this.toPlaceholder;
    this.toPlaceholder = tempPlaceholder;
  }

  onDirectionFromSelected(direction: any) {
    this.from = direction.city;
  }

  onDirectionToSelected(direction: any) {
    this.to = direction.city;
  }

  openModalPassengers() {
    this.modalPassengers.openModal();
  }

  handleSelectedDates(startDate: Date, endDate: Date | null) {
    const formatMonth = (date: Date) => {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }; // Уточняем тип для параметров
      return date.toLocaleDateString('ru-RU', options);
    };

    if (startDate && endDate) {
      this.selectedDateText = `${formatMonth(startDate)} - ${formatMonth(endDate)}`;
    } else if (startDate) {
      this.selectedDateText = formatMonth(startDate);
    } else {
      this.selectedDateText = 'Сегодня';
    }
  }
}
