import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-card-button',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './add-card-button.component.html',
  styleUrl: './add-card-button.component.scss'
})
export class AddCardButtonComponent {

}
