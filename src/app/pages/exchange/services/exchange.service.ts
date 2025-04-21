import { Injectable } from '@angular/core';
import { lastValueFrom } from "rxjs";
import {
  ICurrentExchange,
  ICurrentExchangeDto,
  IDailyExchange,
  IDailyExchangeDto
} from "@app/pages/exchange/interfaces/exchange.interface";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "@env/environment";

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private enAken = environment.enAken;
  private baseUrl = 'https://api-brl-exchange.actionlabs.com.br/api/1.0/open';

  constructor(private httpClient: HttpClient) {
  }

  public async getCurrentExchange(fromSymbol: string, toSymbol: string): Promise<ICurrentExchange> {
    const url = this.baseUrl + `/currentExchangeRate?apiKey=${this.enAken}&from_symbol=${fromSymbol}&to_symbol=${toSymbol}`
    const currentExchange$ = this.httpClient.get<ICurrentExchangeDto>(url);
    return await lastValueFrom(currentExchange$)
      .then((data) => {
        if (!data.success) throw new Error();
        const currentExchange = this.mapperCurrentExchange(data);
        return currentExchange;
      })
      .catch((error) => {
        console.error('API Error Details:', error);
        throw new HttpErrorResponse(error);
      })
  }

  public async getDailyExchange(fromSymbol: string, toSymbol: string): Promise<IDailyExchange[]> {
    const url = this.baseUrl + `/dailyExchangeRate?apiKey=${this.enAken}&from_symbol=${fromSymbol}&to_symbol=${toSymbol}`
    const dailyExchange$ = this.httpClient.get<IDailyExchangeDto>(url);
    return await lastValueFrom(dailyExchange$)
      .then((data) => {
        const dailyExchange = this.mapperDailyExchange(data);
        return dailyExchange;
      })
      .catch((error) => {
        throw new HttpErrorResponse(error);
      })
  }

  private mapperCurrentExchange(data: ICurrentExchangeDto): ICurrentExchange {
    return {
      exchangeRate: data.exchangeRate,
      fromSymbol: data.fromSymbol,
      toSymbol: data.toSymbol,
      lastUpdatedAt: data.lastUpdatedAt,
    }
  }

  private mapperDailyExchange(data: IDailyExchangeDto): IDailyExchange[] {
    data.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let previousClose: number | null = null;
    const mappedData: IDailyExchange[] = [];

    for (let i = 0; i < data.data.length; i++) {
      const currentItem = data.data[ i ];

      let closeDiff = 0;
      if (previousClose !== null) {
        closeDiff = (currentItem.close - previousClose) / previousClose;
      }

      const mappedItem: IDailyExchange = {
        close: currentItem.close,
        date: new Date(currentItem.date),
        high: currentItem.high,
        low: currentItem.low,
        open: currentItem.open,
        closeDiff: closeDiff
      };

      mappedData.push(mappedItem);

      previousClose = currentItem.close;
    }

    return mappedData;
  }
}
