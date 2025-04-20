import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ExchangeComponent } from '@app/pages/exchange/exchange.component';

const routes: Routes = [
  {
    path: '',
    component: ExchangeComponent
  },
];

@NgModule({
  imports:[RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class ExchangeRoutingModule {}
