import { Component, Input, OnInit } from '@angular/core';
import { IDailyExchange } from "@app/pages/exchange/interfaces/exchange.interface";

@Component({
  selector: 'app-days-card',
  templateUrl: './days-card.component.html',
  styleUrls: ['./days-card.component.scss']
})
export class DaysCardComponent implements OnInit {
  @Input() items: IDailyExchange[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
