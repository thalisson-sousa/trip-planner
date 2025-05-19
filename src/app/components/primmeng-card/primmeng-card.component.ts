import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-primmeng-card',
  imports: [],
  templateUrl: './primmeng-card.component.html',
  styleUrl: './primmeng-card.component.scss'
})
export class PrimmengCardComponent {
  @Input() title: string = '';
  @Input() data: string = '';
  @Input() destination: string = '';
  @Input() coast: string = '';
}
