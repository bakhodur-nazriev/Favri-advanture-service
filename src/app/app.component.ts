import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CustomInputComponent} from "./custom-input/custom-input.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomInputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Favri-advanture-service';
}
