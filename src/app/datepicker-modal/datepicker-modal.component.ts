import {ChangeDetectorRef, Component, EventEmitter, model, Output, ViewChild} from '@angular/core';
import {animate, style, transition, trigger, AnimationEvent} from "@angular/animations";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {CustomDatePickerComponent} from "../custom-date-picker/custom-date-picker.component";
import {CalendarHeaderComponent, CustomDateAdapter} from '../calendar-header/calendar-header.component';

import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {DateAdapter} from "@angular/material/core";
import {IconComponent} from "../shared/icon/icon.component";

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
    MatIcon,
    MatToolbar,
    MatIconButton,
    CalendarHeaderComponent,
    IconComponent,
    NgForOf,
    NgClass
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
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter
    },
  ],
})
export class DatepickerModalComponent {
  @Output() startDateSelected = new EventEmitter<{ startDate: Date | null }>();
  @Output() datesSelected = new EventEmitter<Date[]>
  @ViewChild(MatCalendar) calendar: MatCalendar<Date> | undefined;

  isVisible = false;
  isAnimating = false;
  selected = model<Date | null>(null);
  selectedDate: Date | null = null;
  calendarHeader = CalendarHeaderComponent;
  months: Date[] = [];
  startDate: Date | null = null;
  minDate: Date = new Date();
  endDate: Date | null = null;
  weeks: string[] = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  constructor(private cdr: ChangeDetectorRef) {
    this.generateMonths();
  }

  onDateSelected(date: Date | null) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = date;
      this.endDate = null;
    } else if (date && this.startDate && date >= this.startDate) {
      this.endDate = date;
    }

    this.datesSelected.emit([this.startDate, this.endDate].filter(d => d !== null) as Date[]);

    if (this.calendar) {
      this.calendar.updateTodaysDate();
      this.calendar._goToDateInView(this.startDate || new Date(), 'month');
    }

    this.cdr.detectChanges();
  }

  confirmDates() {
    if (this.startDate) {
      this.startDateSelected.emit({startDate: this.startDate});
    }
    this.closeModal();
  }

  clearSelectedDate() {
    this.selectedDate = null;
    this.startDate = null;
    this.endDate = null;
    this.datesSelected.emit([]);
  }

  formatSelectedDate(selectedDate: Date | null): string {
    if (!selectedDate) return 'дату';

    const day = selectedDate.getDate();
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const month = monthNames[selectedDate.getMonth()];

    return `${day} ${month}`;
  }

  generateMonths() {
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
      this.months.push(month);
    }
  }

  openDepartureModal() {
    this.isVisible = true;
  }

  closeModal() {
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.isVisible = false;
    }
  }

  dateClass = (date: Date): string => {
    if (this.startDate && !this.endDate) {
      if (date.getTime() === this.startDate.getTime()) {
        return 'mat-calendar-range-start';
      }
    }

    if (this.startDate && this.endDate) {
      if (date.getTime() === this.startDate.getTime()) {
        return 'mat-calendar-range-start';
      }
      if (date.getTime() === this.endDate.getTime()) {
        return 'mat-calendar-range-end';
      }
      if (date > this.startDate && date < this.endDate) {
        return 'mat-calendar-in-range';
      }
    }

    const day = date.getDay();

    if (day === 6 || day === 0) {
      return 'weekend-day';
    }

    return '';
  };

  onAnimationEvent(event: AnimationEvent) {
    if (event.phaseName === 'done' && event.toState === 'void') {
      this.isVisible = false;
      this.isAnimating = false;
    }
  }
}
