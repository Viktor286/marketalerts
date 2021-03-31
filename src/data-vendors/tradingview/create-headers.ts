import { HeadersInit } from 'node-fetch';

export default (
  postBodyContent: string | Record<string, unknown>,
): HeadersInit => ({
  // ':authority:': 'scanner.tradingview.com',
  // ':method:': 'POST',
  // ':path:': '/america/scan',
  // ':scheme:': 'https',
  accept: 'text/plain, */*; q=0.01',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'q=0.9,en-US;q=0.8,en;q=0.7',
  'content-length':
    typeof postBodyContent === 'string'
      ? postBodyContent.length.toString(10)
      : JSON.stringify(postBodyContent).length.toString(10),
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  origin: 'https://www.tradingview.com',
  referer: 'https://www.tradingview.com/',
  'sec-ch-ua':
    '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
});
