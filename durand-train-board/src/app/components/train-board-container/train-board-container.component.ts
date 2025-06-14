import { Component } from '@angular/core';
import { AppBarComponent } from "../app-bar/app-bar.component";
import { RailroadCardComponent } from "../railroad-card/railroad-card.component";
import { AddCardButtonComponent } from "../add-card-button/add-card-button.component";
import { RailroadCardsService } from '../../services/railroad-cards.service';
import { Card } from '../../models/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-train-board-container',
  imports: [AppBarComponent, RailroadCardComponent, AddCardButtonComponent, CommonModule],
  templateUrl: './train-board-container.component.html',
  styleUrl: './train-board-container.component.scss'
})
export class TrainBoardContainerComponent {
  constructor(private cardsService: RailroadCardsService) {}

  getCards(): Card[] {
    return this.cardsService.getCards();
  }
}
