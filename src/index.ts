import marketWatcher from './market-watcher';
import AlertsManager from './alerts-manager';
import { frequencySeconds } from './app-congif';
import { getRandomInt } from './utils';

const alertsManager = new AlertsManager();

(async () => {
  await marketWatcher(alertsManager);
  setInterval(
    () => marketWatcher(alertsManager),
    (frequencySeconds + getRandomInt(0, frequencySeconds)) * 1000,
  );
})();
