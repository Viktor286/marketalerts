import config from './vendor-config';
const marketData = require(`./${config.vendor}`);

export default marketData.default;
