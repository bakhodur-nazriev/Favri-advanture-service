import {Component, EventEmitter, model, Output} from '@angular/core';
import {animate, style, transition, trigger, AnimationEvent} from "@angular/animations";
import {DatePipe, NgIf} from "@angular/common";
import {CustomDatePickerComponent} from "../custom-date-picker/custom-date-picker.component";

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-datepicker-modal',
  standalone: true,
  imports: [
    NgIf,
    CustomDatePickerComponent,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    DatePipe,
    FormsModule,
    MatIcon
  ],
  templateUrl: './datepicker-modal.component.html',
  styleUrl: './datepicker-modal.component.scss',
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
export class DatepickerModalComponent {
  public isVisible = false;
  public isAnimating = false;
  selected = model<Date | null>(null);
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  public selectedDate: Date | null = null;
  public minDate: Date = new Date();
  @Output() datesSelected = new EventEmitter<{ startDate: Date, endDate: Date | null }>();

  clearStartDate() {
    this.startDate = null;
  }
  clearEndDate() {
    this.endDate = null;
  }
  openModal() {
    this.isVisible = true;
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
  onDateSelected(date: Date | null) {
    // Если выбрана новая дата и уже есть стартовая дата, очищаем предыдущие значения
    if (!this.startDate) {
      this.startDate = date;
    } else if (!this.endDate) {
      this.endDate = date;
    } else {
      // Если обе даты уже выбраны, очищаем их и устанавливаем новую стартовую дату
      this.startDate = date;
      this.endDate = null;
    }

    // Уведомляем родительский компонент о выборе дат
    // @ts-ignore
    this.datesSelected.emit({ startDate: this.startDate, endDate: this.endDate });
  }
  confirmDates() {
    if (this.startDate) {
      this.datesSelected.emit({ startDate: this.startDate, endDate: this.endDate });
    }
    this.closeModal();
  }
}
