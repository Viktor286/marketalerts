import { IProvider, IProviderMsgResult } from '../index';
import { WebClient } from '@slack/web-api';
import config from './config';

export default class Slack implements IProvider {
  client: WebClient = new WebClient(config.token);
  subscribers: string[] = config.recipients;

  public async sendMsgToSubscriber(
    subscriberId = '',
    textMsg = '',
  ): Promise<IProviderMsgResult> {
    let result;

    try {
      result = await this.client.chat.postMessage({
        channel: subscriberId,
        text: textMsg,
      }); // returns WebAPICallResult
    } catch (e) {
      return {
        status: false,
        result: e,
      };
    }

    return {
      status: true,
      result: result,
    };
  }

  public async sendMsgToAllSubscribers(
    textMsg = '',
  ): Promise<IProviderMsgResult[]> {
    const requests: Promise<IProviderMsgResult>[] = [];
    this.subscribers.length > 0 &&
      this.subscribers.forEach((id) =>
        requests.push(this.sendMsgToSubscriber(id, textMsg)),
      );
    return Promise.all(requests);
  }
}
