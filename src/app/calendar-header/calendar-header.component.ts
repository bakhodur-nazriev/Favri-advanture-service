import {Component, Injectable} from '@angular/core';
import {MatCalendar} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {DatePipe} from "@angular/common";
import {NativeDateAdapter} from "@angular/material/core";
import {CapitalizePipe} from '../capitalize.pipe';

@Component({
  selector: 'app-calendar-header',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, DatePipe, CapitalizePipe],
  template: `
    <div class="custom-header">
      <button mat-icon-button (click)="previousClicked()">
        <mat-icon>chevron_left</mat-icon>
      </button>
      <div class="month-display">
        {{ calendar.activeDate | date: 'MMMM yyyy' | capitalize }}
      </div>
      <button mat-icon-button (click)="nextClicked()">
        <mat-icon>chevron_right</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .custom-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    }

    .month-display {
      font-size: 18px;
      font-weight: 700;
    }
  `]
})

export class CalendarHeaderComponent {
  constructor(public calendar: MatCalendar<Date>) {
  }

  previousClicked(): void {
    this.calendar.activeDate = new Date(
      this.calendar.activeDate.getFullYear(),
      this.calendar.activeDate.getMonth() - 1,
      1
    );
  }

  nextClicked(): void {
    this.calendar.activeDate = new Date(
      this.calendar.activeDate.getFullYear(),
      this.calendar.activeDate.getMonth() + 1,
      1
    );
  }
}

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override getDayOfWeekNames(): string[] {
    return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  }

  override getMonthNames(): string[] {
    return [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
  }
}
