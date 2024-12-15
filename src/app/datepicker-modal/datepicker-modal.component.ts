import {ChangeDetectorRef, Component, EventEmitter, model, Output, ViewChild} from '@angular/core';
import {animate, style, transition, trigger, AnimationEvent} from "@angular/animations";
import {DatePipe, NgIf} from "@angular/common";
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
    CalendarHeaderComponent
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
  @Output() datesSelected = new EventEmitter<{ startDate: Date, endDate: Date | null }>();
  @ViewChild(MatCalendar) calendar: MatCalendar<Date> | undefined;

  public isVisible = false;
  public isAnimating = false;
  selected = model<Date | null>(null);
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  public selectedDate: Date | null = null;
  public minDate: Date = new Date();
  calendarHeader = CalendarHeaderComponent;

  constructor(private cdr: ChangeDetectorRef) {
  }

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

    return '';
  };

  onDateSelected(date: Date | null) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = date;
      this.endDate = null;
    } else if (date && this.startDate && date >= this.startDate) {
      this.endDate = date;
    }

    this.datesSelected.emit({
      startDate: this.startDate as Date,
      endDate: this.endDate,
    });

    if (this.calendar) {
      this.calendar.updateTodaysDate();
    }

    this.cdr.detectChanges();
  }


  confirmDates() {
    if (this.startDate) {
      this.datesSelected.emit({startDate: this.startDate, endDate: this.endDate});
    }
    this.closeModal();
  }
}
