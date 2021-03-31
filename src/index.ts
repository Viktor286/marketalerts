import marketWatcher from './market-watcher';
import AlertsManager from './alerts-manager';
import { frequencySeconds } from './app-congif';
import { getRandomInt } from './utils';

const alertManager = new AlertsManager();

(async () => {
  await marketWatcher(alertManager);
  setInterval(
    () => marketWatcher(alertManager),
    (frequencySeconds + getRandomInt(0, frequencySeconds)) * 1000,
  );
})();
