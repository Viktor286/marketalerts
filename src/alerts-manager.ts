import RulesManager, { IRule } from './rules-manager';
import { ITicketData } from './data-vendors/tradingview';

export interface IAlertStatus {
  [index: string]: number;
  pending?: number;
  fulfilled?: number;
}

export interface IAlertMessage {
  alertRule: IRule;
  ticketData: Partial<ITicketData>;
  status: Extract<keyof IAlertStatus, number>;
}

const alertStatus = {
  pending: 0,
  fulfilled: 1,
};

export default class AlertsManager {
  private ledger: Map<string, IAlertMessage> = new Map();

  addAlert(alertRule: IRule, ticketData: Partial<ITicketData>) {
    const ruleToTicketId = RulesManager.createRuleToTicketId(
      alertRule,
      ticketData,
    );
    const alertMsgObj = AlertsManager.createAlertMsgObj(alertRule, ticketData);
    if (!this.ledger.has(ruleToTicketId))
      this.ledger.set(ruleToTicketId, alertMsgObj);
  }

  static createAlertMsgObj(
    alertRule: IRule,
    ticketData: Partial<ITicketData>,
  ): IAlertMessage {
    return {
      alertRule,
      ticketData,
      status: alertStatus.pending,
    };
  }

  createAlertView({
    alertRule,
    ticketData,
  }: {
    alertRule: IRule;
    ticketData: Partial<ITicketData>;
  }): string {
    switch (alertRule.operator) {
      case 'greater-or-less':
        const ticketDataValue = ticketData[alertRule.target];
        return `${
          ticketData.ticket
        } just moved to ${alertRule.target.toUpperCase()} ${
          typeof ticketDataValue === 'number'
            ? ticketDataValue.toFixed(2)
            : ticketDataValue
        } | Rule: '${alertRule.operator}' ${
          alertRule.value
        } ${alertRule.target.toUpperCase()} at ${new Date().toLocaleString()}`;
    }
  }

  async execAllAlerts(): Promise<boolean> {
    let alertDocument = `Market Watcher update:\n`;
    const sendingBatch: IAlertMessage[] = [];

    // Prepare common VIEW for all alerts
    this.ledger.forEach((alertMsgObj) => {
      if (alertMsgObj.status === alertStatus.pending) {
        alertDocument = alertDocument
          .concat(this.createAlertView(alertMsgObj))
          .concat('\n');
        sendingBatch.push(alertMsgObj);
      }
    });

    // Send if there was a content to send
    if (sendingBatch.length) {
      try {
        await this.sendAlert(alertDocument);
        sendingBatch.forEach(
          (alertMsgObj) => (alertMsgObj.status = alertStatus.fulfilled),
        );
      } catch (e) {
        console.error("Couldn't send alert, will try on a next cycle");
        return false;
      }
    } else {
      console.log('Alerts Manager: idle');
    }

    return true;
  }

  // todo: implement sending service drivers
  async sendAlert(alertDocument: string): Promise<boolean> {
    console.log(
      `AlertsManager: sending alert via Telegram and Mail\n===\n${alertDocument}===`,
    );
    return true;
  }
}
