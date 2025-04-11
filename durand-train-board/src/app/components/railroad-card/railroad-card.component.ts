import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-railroad-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './railroad-card.component.html',
  styleUrl: './railroad-card.component.scss'
})
export class RailroadCardComponent {

}
