import { Component } from '@angular/core';
import { BannerComponent } from '../../components/banner/banner.component';
import { HowWorksComponent } from "../../components/how-works/how-works.component";
import { PrimmengCardComponent } from "../../components/primmeng-card/primmeng-card.component";

@Component({
  selector: 'app-home',
  imports: [BannerComponent, HowWorksComponent, PrimmengCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
