import { MotivationalQuote } from "./motivational-quote.entity";
export { MotivationalQuote } from "./motivational-quote.entity";

export const motivatinalQuoteProvider = [
  {
    provide: 'MOTIVATIONAL_QUOTE_REPOSITORY',
    useValue: MotivationalQuote,
  },
];