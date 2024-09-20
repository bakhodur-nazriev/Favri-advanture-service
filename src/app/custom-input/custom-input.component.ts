import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [],
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
}
