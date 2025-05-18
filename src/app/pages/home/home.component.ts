import { Component } from '@angular/core';
import { BannerComponent } from '../../components/banner/banner.component';
import { HowWorksComponent } from "../../components/how-works/how-works.component";

@Component({
  selector: 'app-home',
  imports: [BannerComponent, HowWorksComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
