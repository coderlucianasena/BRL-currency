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
  private baseUrl = '/api'; // Alterado para usar o proxy

  constructor(private httpClient: HttpClient) {}

  public async getCurrentExchange(fromSymbol: string, toSymbol: string): Promise<ICurrentExchange> {
    const url = `${this.baseUrl}/currentExchangeRate?apiKey=${this.enAken}&from_symbol=${fromSymbol}&to_symbol=${toSymbol}`;
    try {
      const currentExchangeDto: ICurrentExchangeDto = await lastValueFrom(
        this.httpClient.get<ICurrentExchangeDto>(url)
      );
      if (!currentExchangeDto.success) {
        throw new Error('API response indicates failure.');
      }
      return this.mapperCurrentExchange(currentExchangeDto);
    } catch (error) {
      this.handleError(error, 'getCurrentExchange');
      throw error;
    }
  }

  public async getDailyExchange(fromSymbol: string, toSymbol: string): Promise<IDailyExchange[]> {
    const url = `${this.baseUrl}/dailyExchangeRate?apiKey=${this.enAken}&from_symbol=${fromSymbol}&to_symbol=${toSymbol}`;
    try {
      const dailyExchangeDto: IDailyExchangeDto = await lastValueFrom(
        this.httpClient.get<IDailyExchangeDto>(url)
      );
      return this.mapperDailyExchange(dailyExchangeDto);
    } catch (error) {
      this.handleError(error, 'getDailyExchange');
      throw error;
    }
  }

  private mapperCurrentExchange(data: ICurrentExchangeDto): ICurrentExchange {
    return {
      exchangeRate: data.exchangeRate,
      fromSymbol: data.fromSymbol,
      toSymbol: data.toSymbol,
      lastUpdatedAt: data.lastUpdatedAt,
    };
  }

  private mapperDailyExchange(data: IDailyExchangeDto): IDailyExchange[] {
    data.data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let previousClose: number | null = null;
    const mappedData: IDailyExchange[] = [];

    for (let i = 0; i < data.data.length; i++) {
      const currentItem = data.data[i];

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
        closeDiff: closeDiff,
      };

      mappedData.push(mappedItem);

      previousClose = currentItem.close;
    }

    return mappedData;
  }

  private handleError(error: any, methodName: string): void {
    if (error instanceof HttpErrorResponse) {
      console.error(`HTTP Error in ${methodName}:`, {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        url: error.url,
      });
    } else {
      console.error(`Unexpected Error in ${methodName}:`, error);
    }
  }
}