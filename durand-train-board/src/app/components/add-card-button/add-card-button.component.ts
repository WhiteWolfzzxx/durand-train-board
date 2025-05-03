import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { AddCardFormComponent } from '../add-card-form/add-card-form.component';

@Component({
  selector: 'app-add-card-button',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './add-card-button.component.html',
  styleUrl: './add-card-button.component.scss'
})
export class AddCardButtonComponent {

  constructor(private dialog: MatDialog) {}

  openAddNewCardForm(): void {
    this.dialog.open(AddCardFormComponent, {
      height: '500px',
      width: '500px'
    })
  }
}
