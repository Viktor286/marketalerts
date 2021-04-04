import createHeaders from './create-headers';
import fetch from 'node-fetch';
import blueChipsRating from './requests/blue-chips-rating';
import { useMockedMarketData } from '../../app-congif';
import blueChipsRatingMockData from './mocks/blue-chips-rating-processed';

// GENERAL MAPPING FOR targetColumns = {
//   'market_cap_basic': 'cap',
//   'Volatility.D': 'vlt_d',
//   'Volatility.W': 'vlt_w',
//   'Volatility.M': 'vlt_m',
//   'volume': 'vol',
//   'change': 'roc_1',
//   'ROC': 'roc_9',
//   'close': 'close',
//   'SMA50': 'avg_2m',
//   'SMA30': 'avg_m',
//   'name': 'ticket',
//   'description': 'title',
// };

interface IBlueChipsRatingOriginElement {
  s: string;
  d: Array<string | number>;
}

export interface ITicketData {
  [index: string]: string | number;
  vlt_d: number;
  vlt_w: number;
  vlt_m: number;
  roc_1: number;
  vol: number;
  close: number;
  ticket: string;
  title: string;
}

export interface ITicketDataVendor {
  [index: string]: string | number;
  'Volatility.D': number;
  'Volatility.W': number;
  'Volatility.M': number;
  change: number;
  volume: number;
  close: number;
  name: string;
  description: string;
}

export default class TradingView {
  static scannerUrl = 'https://scanner.tradingview.com/america/scan';

  static requests = {
    blueChipsRating,
  };

  static createHeaders = createHeaders;

  static getBlueChipsRating = async function (): Promise<
    Partial<ITicketData>[]
  > {
    if (useMockedMarketData) {
      console.log('(Mock data used)');
      return blueChipsRatingMockData;
    }

    const body = TradingView.requests.blueChipsRating;

    const response = await fetch(TradingView.scannerUrl, {
      method: 'post',
      body: typeof body !== 'string' ? JSON.stringify(body) : body,
      headers: TradingView.createHeaders(body),
    });

    const responseJson = await response.json();
    const blueChipsRatings = responseJson.data as IBlueChipsRatingOriginElement[];

    const targetColumns: Record<
      Extract<keyof ITicketDataVendor, string>,
      Extract<keyof ITicketData, string>
    > = {
      'Volatility.D': 'vlt_d',
      'Volatility.W': 'vlt_w',
      'Volatility.M': 'vlt_m',
      change: 'roc_1',
      volume: 'vol',
      close: 'close',
      name: 'ticket',
      description: 'title',
    };

    const batchData: Partial<ITicketData>[] = [];
    blueChipsRatings.forEach((ticketPayload) => {
      const ticketData: Partial<ITicketData> = {};
      TradingView.requests.blueChipsRating.columns.forEach((colStr, i) => {
        if (colStr in targetColumns)
          ticketData[targetColumns[colStr]] = ticketPayload.d[i];
      });
      batchData.push(ticketData);
    });

    return batchData;
  };
}
