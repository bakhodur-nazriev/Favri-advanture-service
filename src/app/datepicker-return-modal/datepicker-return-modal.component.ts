import {ChangeDetectorRef, Component, EventEmitter, model, Output, ViewChild} from '@angular/core';
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
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('0.1s ease-in', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.1s ease-out', style({ transform: 'translateY(100%)', opacity: 0 }))
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
  @ViewChild(MatCalendar) calendar: MatCalendar<Date> | undefined;

  isVisible = false;
  isAnimating = false;
  selected = model<Date | null>(null);
  startDate: Date | null = null;
  selectedDate: Date | null = null;
  calendarHeader = CalendarHeaderComponent;
  months: Date[] = [];
  weeks: string[] = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  minDate: Date = new Date();
  endDate: Date | null = null;

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

    return '';
  };

  onDateSelected(date: Date | null) {
    this.selectedDate = date;
    this.endDateSelected.emit({endDate: date});
    this.cdr.detectChanges();
  }

  // onDateSelected(date: Date | null) {
  //   if (!this.startDate || (this.startDate && this.endDate)) {
  //     this.startDate = date;
  //     this.endDate = null;
  //   } else if (date && this.startDate && date >= this.startDate) {
  //     this.endDate = date;
  //   }
  //
  //   this.datesSelected.emit({
  //     startDate: this.startDate as Date,
  //     endDate: this.endDate,
  //   });
  //
  //   if (this.calendar) {
  //     this.calendar.updateTodaysDate();
  //   }
  //
  //   this.cdr.detectChanges();
  // }

  confirmDates() {
    if (this.startDate) {
      this.endDateSelected.emit({endDate: this.endDate});
    }
    this.closeModal();
  }
}
