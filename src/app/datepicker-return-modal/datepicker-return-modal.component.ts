import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  model,
  Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {animate, style, transition, trigger, AnimationEvent} from "@angular/animations";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
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
  selector: 'app-datepicker-return-modal',
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
    NgForOf
  ],
  templateUrl: './datepicker-return-modal.component.html',
  styleUrl: './datepicker-return-modal.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(100%)', opacity: 0}),
        animate('0.1s ease-in', style({transform: 'translateY(0)', opacity: 1}))
      ]),
      transition(':leave', [
        animate('0.1s ease-out', style({transform: 'translateY(100%)', opacity: 0}))
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
export class DatepickerReturnModalComponent {
  @Output() endDateSelected = new EventEmitter<{ endDate: Date | null }>();
  @Output() datesSelected = new EventEmitter<Date[]>
  @ViewChildren(MatCalendar) calendars!: QueryList<MatCalendar<Date>>

  isVisible = false;
  isAnimating = false;
  selectedDates: Date[] = [];
  calendarHeader = CalendarHeaderComponent;
  months: Date[] = [];
  startDate: Date | null = null;
  minDate: Date = new Date();
  endDate: Date | null = null;
  weeks: string[] = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  constructor(private cdr: ChangeDetectorRef) {
    this.generateMonths();
  }

  generateMonths() {
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() + i, 1);
      this.months.push(month);
    }
  }

  openReturnModal() {
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

  dateClass = (date: Date): string => {
    const day = date.getDay();

    if (day === 6 || day === 0) {
      return 'weekend-day';
    }

    if (this.endDate && date.getTime() === this.endDate.getTime()) {
      return 'mat-calendar-range-end';
    }

    return '';
  };

  onDateSelected(date: Date | null) {
    if (!date) return;

    // Если endDate уже выбран и пользователь нажимает на ту же дату, отменяем выбор
    if (this.endDate && date.getTime() === this.endDate.getTime()) {
      this.endDate = null;
    } else {
      this.endDate = date;
    }

    // Отправляем выбранную дату
    this.endDateSelected.emit({ endDate: this.endDate });

    // Обновляем все календари
    setTimeout(() => {
      this.calendars.forEach(calendar => calendar.updateTodaysDate());
    }, 0);

    this.cdr.detectChanges();
  }

  confirmDates() {
    if (this.endDate) {
      this.endDateSelected.emit({ endDate: this.endDate });
    }
    this.closeModal();
  }

  formatSelectedDate(): string {
    const monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];

    if (this.startDate && this.endDate) {
      const startDay = this.startDate.getDate();
      const endDay = this.endDate.getDate();

      const startMonth = monthNames[this.startDate.getMonth()];
      const endMonth = monthNames[this.endDate.getMonth()];

      if (this.startDate.getMonth() === this.endDate.getMonth()) {
        return `${startDay} - ${endDay} ${startMonth}`;
      } else {
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
      }
    }

    if (this.startDate) {
      return `${this.startDate.getDate()} ${monthNames[this.startDate.getMonth()]}`;
    }

    return 'дату';
  }

  clearSelectedDate() {
    this.endDate = null;
    this.endDateSelected.emit({ endDate: null });

    if (this.calendars) {
      this.calendars.forEach(calendar => calendar.updateTodaysDate());
    }

    this.cdr.detectChanges();
  }
}
