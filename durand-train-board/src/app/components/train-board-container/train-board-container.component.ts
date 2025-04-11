import { Component } from '@angular/core';
import { AppBarComponent } from "../app-bar/app-bar.component";
import { RailroadCardComponent } from "../railroad-card/railroad-card.component";

@Component({
  selector: 'app-train-board-container',
  imports: [AppBarComponent, RailroadCardComponent],
  templateUrl: './train-board-container.component.html',
  styleUrl: './train-board-container.component.scss'
})
export class TrainBoardContainerComponent {

}
