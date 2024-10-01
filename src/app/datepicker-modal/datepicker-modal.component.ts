import {Component, model} from '@angular/core';
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
  public isVisible = true;
  public isAnimating = false;
  selected = model<Date | null>(null);
  public startDate: Date | null = null;
  public endDate: Date | null = null;
  public selectedDate: Date | null = null;
  minDate: Date = new Date();
  inputFromValue: string = '';
  inputToValue: string = '';
  isFromFocused: boolean = false;
  isToFocused: boolean = false;

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
    if (!this.startDate) {
      this.startDate = date;
    } else if (!this.endDate) {
      this.endDate = date;
    } else {
      this.startDate = date;
      this.endDate = null;
    }
  }

  onFromFocus() {
    this.isFromFocused = true;
  }

  onFromBlur() {
    this.isFromFocused = false;
  }

  onToFocus() {
    this.isToFocused = true;
  }

  onToBlur() {
    this.isToFocused = false;
  }
}
