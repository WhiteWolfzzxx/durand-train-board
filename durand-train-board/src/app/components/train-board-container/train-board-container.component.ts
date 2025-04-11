import { Component } from '@angular/core';
import { AppBarComponent } from "../app-bar/app-bar.component";
import { RailroadCardComponent } from "../railroad-card/railroad-card.component";
import { AddCardButtonComponent } from "../add-card-button/add-card-button.component";

@Component({
  selector: 'app-train-board-container',
  imports: [AppBarComponent, RailroadCardComponent, AddCardButtonComponent],
  templateUrl: './train-board-container.component.html',
  styleUrl: './train-board-container.component.scss'
})
export class TrainBoardContainerComponent {

}
