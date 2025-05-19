import { Component } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-how-works',
  imports: [CardComponent, RouterLink],
  templateUrl: './how-works.component.html',
  styleUrl: './how-works.component.scss'
})
export class HowWorksComponent {

}
