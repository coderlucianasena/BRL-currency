import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  // Data atual para uso nas simulações
  private currentDate = new Date();
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verificar se a requisição é para supportedCurrencies
    if (request.url.includes('/api/supportedCurrencies')) {
      console.log('Interceptando chamada para supportedCurrencies');
      // Retorna exatamente a mesma lista que está no componente
      return of(new HttpResponse({
        status: 200,
        body: ["AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN", "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BOV", "BRL", "BSD", "BTN", "BWP", "BYR", "BZD", "CAD", "CDF", "CHE", "CHF", "CHW", "CLF", "CLP", "CNY", "COP", "COU", "CRC", "CUC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "EUR", "FJD", "FKP", "GBP", "GEL", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF", "IDR", "ILS", "INR", "IQD", "IRR", "ISK", "JMD", "JOD", "JPY", "KES", "KGS", "KHR", "KMF", "KPW", "KRW", "KWD", "KYD", "KZT", "LAK", "LBP", "LKR", "LRD", "LSL", "LTL", "LVL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT", "MOP", "MRO", "MUR", "MVR", "MWK", "MXN", "MXV", "MYR", "MZN", "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLL", "SOS", "SRD", "SSP", "STD", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS", "UAH", "UGX", "USD", "USN", "USS", "UYI", "UYU", "UZS", "VEF", "VND", "VUV", "WST", "XAF", "XAG", "XAU", "XBA", "XBB", "XBC", "XBD", "XCD", "XDR", "XFU", "XOF", "XPD", "XPF", "XPT", "XTS", "XXX", "YER", "ZAR", "ZMW"]
      }));
    }
    
    // Verifica se a requisição é para a API de câmbio
    if (request.url.includes('/api/currentExchangeRate') || 
        request.url.includes('/api/dailyExchangeRate')) {
      
      // Extrai os parâmetros da URL
      const urlParts = request.url.split('?');
      const params = new URLSearchParams(urlParts[1]);
      const fromSymbol = params.get('from_symbol') || '';
      const toSymbol = params.get('to_symbol') || '';
      
      console.log(`Interceptando chamada API: ${request.url}`);
      console.log(`Parâmetros: from=${fromSymbol}, to=${toSymbol}`);
      
      // Se for a chamada para taxa atual
      if (request.url.includes('/currentExchangeRate')) {
        return of(new HttpResponse({
          status: 200,
          body: this.getMockCurrentRate(fromSymbol, toSymbol)
        }));
      }
      
      // Se for a chamada para taxas diárias
      if (request.url.includes('/dailyExchangeRate')) {
        return of(new HttpResponse({
          status: 200,
          body: this.getMockDailyRates(fromSymbol, toSymbol)
        }));
      }
    }
    
    // Para qualquer outra requisição, deixa passar normalmente
    return next.handle(request);
  }
  
  private getMockCurrentRate(fromSymbol: string, toSymbol: string): any {
    const rate = this.getExchangeRate(fromSymbol, toSymbol);
    
    return {
      success: true,
      rateLimitExceeded: false,
      exchangeRate: rate,
      fromSymbol: fromSymbol,
      toSymbol: toSymbol,
      lastUpdatedAt: new Date().toISOString()
    };
  }
  
  private getMockDailyRates(fromSymbol: string, toSymbol: string): any {
    const baseRate = this.getExchangeRate(fromSymbol, toSymbol);
    const data = [];
    
    // Gera dados para os últimos 30 dias
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Varia a taxa em +/- 3% para criar dados realistas
      const randomFactor = 0.97 + (Math.random() * 0.06);
      const dayRate = baseRate * randomFactor;
      
      // Varia open, high, low em torno da taxa do dia
      const open = dayRate * (0.99 + (Math.random() * 0.02));
      const high = dayRate * (1.005 + (Math.random() * 0.01));
      const low = dayRate * (0.99 - (Math.random() * 0.01));
      
      data.push({
        date: date.toISOString(),
        open: open,
        close: dayRate,
        high: high,
        low: low
      });
    }
    
    return {
      success: true,
      data: data
    };
  }
  
  private getExchangeRate(fromSymbol: string, toSymbol: string): number {
    // Taxas de câmbio simuladas (em relação ao BRL)
    const ratesBRL: { [key: string]: number } =  {
      'USD': 5.00,
      'EUR': 5.50,
      'GBP': 6.30,
      'JPY': 0.035,
      'CAD': 3.75,
      'AUD': 3.40,
      'CHF': 5.65,
      'CNY': 0.70,
      'BRL': 1.00
    };
    
    // Gera um valor consistente para moedas não listadas usando o código da moeda
    const getConsistentRate = (symbol: string): number => {
      if (ratesBRL[symbol]) return ratesBRL[symbol];
      
      // Usa o código ASCII dos caracteres para gerar um valor consistente
      let value = 1.0;
      for (let i = 0; i < symbol.length; i++) {
        value += symbol.charCodeAt(i) / 1000;
      }
      return value;
    };
    
    const fromRate = getConsistentRate(fromSymbol);
    const toRate = getConsistentRate(toSymbol);
    
    // Calcula a taxa de câmbio relativa
    return fromRate / toRate;
  }
}