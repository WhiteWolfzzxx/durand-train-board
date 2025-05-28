import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Card } from '../../models/card';
import { RailroadCardsService } from '../../services/railroad-cards.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCardFormComponent } from '../add-card-form/add-card-form.component';

@Component({
  selector: 'app-railroad-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './railroad-card.component.html',
  styleUrl: './railroad-card.component.scss'
})
export class RailroadCardComponent {
  @Input({required: true}) card: Card;

  constructor(private cardsService: RailroadCardsService, private dialog: MatDialog) {}

  remove(): void {
    this.cardsService.deleteCard(this.card.id);
  }

  edit(): void {
    this.dialog.open(AddCardFormComponent, {
      height: '800px',
      width: '800px',
      data: {
        card: this.card
      }
    });
  }
}
