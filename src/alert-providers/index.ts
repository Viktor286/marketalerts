const path = require('path');
const fs = require('fs');

export interface IProvider {
  sendMsgToSubscriber(
    subscriberId: string,
    textMsg: string,
  ): Promise<IProviderMsgResult>;
  sendMsgToAllSubscribers(textMsg: string): Promise<IProviderMsgResult[]>;
}

export interface IProviderMsgResult {
  // eslint-disable-next-line @typescript-eslint/ban-types
  result: object; // temp generalization, todo: wire up vendor's return type
  status: boolean;
}

export default class AlertProviders {
  list: Map<string, IProvider> = new Map();

  constructor() {
    // load all providers from current folder
    fs.readdirSync(__dirname).forEach((element: string) => {
      if (fs.lstatSync(path.resolve(__dirname, element)).isDirectory()) {
        const Provider = require(`./${element}`).default;
        this.addProvider(element, new Provider());
      }
    });
  }

  public addProvider(providerName: string, provider: IProvider): string {
    this.list.set(providerName, provider);
    return providerName;
  }

  /** This is temp method until pipeline refined */
  public async notifyAllProviders(msg = ''): Promise<IProviderMsgResult[][]> {
    const r: Promise<IProviderMsgResult[]>[] = [];
    this.list.forEach((provider) =>
      r.push(provider.sendMsgToAllSubscribers(msg)),
    );
    return Promise.all(r);
  }
}
