import marketData from './data-vendors';
import RulesManager from './rules-manager';
import AlertsManager from './alerts-manager';
import { ITicketData } from './data-vendors/tradingview';

const marketWatcher = async (alertsManager: AlertsManager): Promise<void> => {
  console.log(
    `[${new Date().toLocaleString()}]\nWatcher: looking into market data...`,
  );

  const batchData: Partial<ITicketData>[] = await marketData.getBlueChipsRating();

  // todo: add mechanism for multiple 'rules' available from the app-config.js
  const alertRule = RulesManager.createRule('roc_1', 'greater-or-less', 3);

  batchData instanceof Array &&
    batchData.forEach((ticketData) => {
      if (RulesManager.applyRuleCondition(alertRule, ticketData)) {
        alertsManager.addAlert(alertRule, ticketData);
      }
    });

  try {
    await alertsManager.execAllAlerts();
    console.log('Watcher cycle: ok'); // todo: aggregate all 'console' usages into inner log(to output into terminal and file)
  } catch (e) {
    console.error("Couldn't send alert, will try on a next cycle");
  }
};

export default marketWatcher;
