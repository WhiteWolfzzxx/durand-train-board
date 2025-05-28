import { Injectable } from '@angular/core';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class RailroadCardsService {
  private cards: Card[] = [];

  constructor() { }

  addCard(card: Card): void {
    card.id = this.getNewId();
    this.cards.push(card);
  }

  getCards(): Card[] {
    return this.cards;
  }

  updateCard(card: Card): void {
    const replaceIndex = this.cards.findIndex(c => c.id === card.id);
    this.cards.splice(replaceIndex, 1, card);
  }

  deleteCard(cardId: number): void {
    const deleteIndex = this.cards.findIndex(c => c.id === cardId);
    this.cards.splice(deleteIndex, 1);
  }

  private getNewId(): number {
    return Math.max(...this.cards.map(c => c.id), 0) + 1;
  }
}
