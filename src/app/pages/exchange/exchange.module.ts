import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeComponent } from './exchange.component';
import { ExchangeRoutingModule } from '@app/pages/exchange/exchange-routing.module';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { DaysCardComponent } from "@shared/components/days-card/days-card.component";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSnackBarModule } from "@angular/material/snack-bar";


@NgModule({
  declarations: [
    ExchangeComponent,
    DaysCardComponent
  ],
  imports: [
    CommonModule,
    ExchangeRoutingModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule
  ],
})
export class ExchangeModule {
}
