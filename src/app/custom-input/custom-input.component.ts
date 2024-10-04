import {Component, Input, forwardRef} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgOptimizedImage
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss'
})
export class CustomInputComponent {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() name: string = '';
  @Input() id: string = '';

  onChange: any = () => {
  };
  onTouched: any = () => {
  };

  // Изменение значения
  writeValue(value: string): void {
    this.value = value;
  }

  // Обработка изменений
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Отслеживание касания
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Блокировка ввода
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Метод для передачи изменения в форму
  handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }
}
