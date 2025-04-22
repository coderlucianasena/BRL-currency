# BRL Exchange Rate

Um aplicativo web Angular para verificar taxas de câmbio do Real Brasileiro (BRL) contra outras moedas.

## Descrição

Este projeto é uma aplicação de página única que permite aos usuários consultar a taxa de câmbio atual do Real Brasileiro em relação a outras moedas. Os usuários também podem verificar o histórico das taxas de câmbio dos últimos 30 dias.

![Mockup](./assets/BRL-exchange-rate.png) 

## Requisitos do Projeto

- Página única para verificar o câmbio do Real Brasileiro (BRL) contra outras moedas
- Campo para o usuário digitar o código da moeda
- Exibição da taxa de câmbio atual
- Opção para verificar a taxa de câmbio dos últimos 30 dias
- Cálculo da diferença entre a taxa de fechamento do dia atual e do dia anterior ("close diff")
- Executável com `ng serve`
- Desenvolvido com Angular 10+

## Tecnologias Utilizadas

- Angular 15.2.10
- TypeScript 4.8.4
- Angular Material
- RxJS
- SCSS para estilização

## Funcionalidades Implementadas

- **Busca de taxa de câmbio atual**: Exibe a taxa de câmbio atual do BRL contra a moeda selecionada
- **Histórico de 30 dias**: Mostra as taxas de câmbio dos últimos 30 dias quando o usuário expande essa seção
- **Cálculo de diferencial de fechamento**: Calcula e exibe a diferença percentual entre a taxa de fechamento do dia atual e do dia anterior
- **Suporte a múltiplas moedas**: Suporta mais de 170 códigos de moedas diferentes
- **Interface responsiva**: Adaptada para funcionar bem tanto em dispositivos móveis quanto desktop
- **Autocomplete para moedas**: Facilita a busca de códigos de moeda

## Desafios e Soluções

### Desafio 1: Inversão de Parâmetros da API

Durante o desenvolvimento, identifiquei que a implementação original utilizava os parâmetros da API (`from_symbol` e `to_symbol`) na ordem inversa da esperada pela especificação. A aplicação estava consultando o valor de outras moedas em BRL, quando deveria consultar o valor do BRL em outras moedas.

**Solução:** Inverti os parâmetros nas chamadas da API para que o BRL fosse sempre a moeda de origem (`from_symbol`).

### Desafio 2: API Indisponível

Após corrigir a lógica de negócio, enfrentei problemas com a API externa que estava retornando `{"success":false,"rateLimitExceeded":false}`, mesmo com a chave de API correta.

**Solução temporária:** Implementei um interceptor HTTP para simular as respostas da API. Esta abordagem permite:
- Demonstrar a funcionalidade completa sem depender da API externa
- Gerar dados realistas para testes
- Manter a mesma estrutura de código que seria usada com a API real

```typescript
@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  // ... código de implementação
}
```

## Como Executar o Projeto

### Pré-requisitos
- Node.js (v16.14.0 ou superior)
- npm (v8 ou superior)

### Instalação
1. Clone o repositório:
   ```
   git clone https://github.com/coderlucianasena/BRL-currency.git
   cd brl-exchange-rate
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Execute o aplicativo:
   ```
   ng serve
   ```

4. Acesse a aplicação em [http://localhost:4200](http://localhost:4200)

## Estrutura do Projeto

```
src/
├── app/
│   ├── pages/
│   │   └── exchange/         # Componente principal
│   │       ├── interfaces/   # Interfaces para tipagem
│   │       └── services/     # Serviços de comunicação com a API
│   └── shared/
│       ├── components/       # Componentes reutilizáveis
│       └── interceptors/     # Interceptores HTTP para mock da API
├── assets/                   # Imagens e recursos estáticos
└── environments/             # Configuração de ambientes
```

## Melhorias Implementadas

- **Tratamento robusto de erros**: Implementação de tratamento de erros detalhado em todas as chamadas de API
- **Prevenção de comportamento indesejado de formulário**: O botão "Exchange Result" foi configurado para prevenir o comportamento padrão de submissão de formulário, evitando recarregamentos de página
- **Suporte a moedas não listadas**: Adição de lógica para gerar taxas de câmbio consistentes mesmo para moedas não listadas explicitamente
- **Design responsivo**: Interface adaptável para diferentes tamanhos de tela


## Observações

Este projeto foi desenvolvido como um teste técnico. A abordagem de simulação da API foi adotada após múltiplas tentativas de utilizar a API real, que consistentemente retornava mensagens de erro mesmo com os parâmetros corretos e seguindo a documentação fornecida.

Em um ambiente de produção, seria recomendado:
1. Resolver as questões de comunicação com a API
2. Implementar um sistema de cache para reduzir o número de requisições
3. Adicionar testes unitários e de integração completos
4. Considerar melhorias de acessibilidade adicionais

---

Desenvolvido por Luciana Sena - 2025
