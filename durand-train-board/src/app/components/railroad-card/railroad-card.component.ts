import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
export class RailroadCardComponent implements OnInit {
  @Input({required: true}) card: Card;
  imageUrl: string;

  constructor(private cardsService: RailroadCardsService, private dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.card.image !== null) {
      this.setImageUrl(this.card.image);
    } else {
      this.imageUrl = this.getRandomImage();
    }
  }

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

  getRandomImage(): string {
    if (this.card.route === "Ann Arbor") {
      return `./assets/images/ann_arbor${this.getRandomIntInclusive(1, 3)}.jpg`;
    }

    return `./assets/images/GTW${this.getRandomIntInclusive(1, 3)}.jpg`;
  }

  private getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private setImageUrl(image: Uint8Array<ArrayBufferLike>): void {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(new Blob([image]));
  }
}
