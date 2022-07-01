import {getAllStats, getBasicInfo, getHeroStats, getMostPlayed} from '../src';
import * as fs from 'fs';
import * as path from 'path';

const battletag = 'xQc-11273',
  platform = 'pc';

(async () => {
  const requests = {
    getAllStats: getAllStats(battletag, platform),
    getBasicInfo: getBasicInfo(battletag, platform),
    getHeroStats: getHeroStats(battletag, platform),
    getMostPlayed: getMostPlayed(battletag, platform),
  };

  const responses: [string, any][] = (
    await Promise.all(Object.values(requests))
  ).map((res, i) => [Object.keys(requests)[i], res]);

  for (const [method, res] of responses) {
    const fn = path.join(__dirname, '../examples', method + '.json');
    fs.writeFileSync(fn, JSON.stringify(res, null, 2));
  }
})();
