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

  // Cache para moedas suportadas
  private supportedCurrenciesCache: string[] | null = null;

  constructor(private httpClient: HttpClient) {}

  /**
   * Busca a taxa de câmbio atual entre duas moedas.
   * @param fromSymbol - Moeda de origem.
   * @param toSymbol - Moeda de destino.
   */
  public async getCurrentExchange(fromSymbol: string, toSymbol: string): Promise<ICurrentExchange> {
    await this.validateCurrencySymbols(fromSymbol, toSymbol); // Validação dinâmica

    const url = `${this.baseUrl}/currentExchangeRate?apiKey=${this.enAken}&from_symbol=${fromSymbol}&to_symbol=${toSymbol}`;
    try {
      const currentExchangeDto: ICurrentExchangeDto = await lastValueFrom(
        this.httpClient.get<ICurrentExchangeDto>(url)
      );

      if (!currentExchangeDto.success) {
        throw new Error('A API retornou sucesso: false. Verifique os símbolos de moeda.');
      }

      return this.mapperCurrentExchange(currentExchangeDto);
    } catch (error) {
      this.handleError(error, 'getCurrentExchange');
      throw error;
    }
  }

  /**
   * Busca a taxa de câmbio diária entre duas moedas.
   * @param fromSymbol - Moeda de origem.
   * @param toSymbol - Moeda de destino.
   */
  public async getDailyExchange(fromSymbol: string, toSymbol: string): Promise<IDailyExchange[]> {
    await this.validateCurrencySymbols(fromSymbol, toSymbol); // Validação dinâmica

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

  /**
   * Valida se as moedas fornecidas são suportadas.
   * @param fromSymbol - Moeda de origem.
   * @param toSymbol - Moeda de destino.
   */
  private async validateCurrencySymbols(fromSymbol: string, toSymbol: string): Promise<void> {
    const supportedCurrencies = await this.fetchSupportedCurrencies();

    if (!supportedCurrencies.includes(fromSymbol)) {
      throw new Error(`O símbolo de moeda "${fromSymbol}" não é suportado.`);
    }
    if (!supportedCurrencies.includes(toSymbol)) {
      throw new Error(`O símbolo de moeda "${toSymbol}" não é suportado.`);
    }
  }

  /**
   * Busca a lista de moedas suportadas da API.
   * Armazena o resultado em cache para evitar múltiplas requisições.
   */
  public async fetchSupportedCurrencies(): Promise<string[]> {
    if (this.supportedCurrenciesCache) {
      return this.supportedCurrenciesCache; // Retorna do cache se disponível
    }

    const url = `${this.baseUrl}/supportedCurrencies?apiKey=${this.enAken}`;
    try {
      const response = await lastValueFrom(this.httpClient.get<string[]>(url));
      this.supportedCurrenciesCache = response; // Atualiza o cache
      return response;
    } catch (error) {
      this.handleError(error, 'fetchSupportedCurrencies');
      throw error;
    }
  }

  /**
   * Mapeia os dados da troca de moeda atual para o formato interno.
   * @param data - Dados da API.
   */
  private mapperCurrentExchange(data: ICurrentExchangeDto): ICurrentExchange {
    return {
      exchangeRate: data.exchangeRate,
      fromSymbol: data.fromSymbol,
      toSymbol: data.toSymbol,
      lastUpdatedAt: data.lastUpdatedAt,
    };
  }

  /**
   * Mapeia os dados da troca de moeda diária para o formato interno.
   * @param data - Dados da API.
   */
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

  /**
   * Lida com erros ocorridos nas requisições HTTP.
   * @param error - Objeto de erro.
   * @param methodName - Nome do método onde o erro ocorreu.
   */
  private handleError(error: any, methodName: string): void {
    if (error instanceof HttpErrorResponse) {
      console.error(`Erro HTTP no método ${methodName}:`, {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        url: error.url,
      });
      alert(`Erro ao chamar a API: ${error.message}`);
    } else {
      console.error(`Erro inesperado no método ${methodName}:`, error);
      alert(`Erro inesperado: ${error}`);
    }
  }
}