import {BasicInfo, getBasicInfo} from './basicinfo';
import {getHtml} from './gethtml';
import {heroIDMap} from './heroids';
import {getHeroStats, HeroStats} from './herostats';
import {getMostPlayed, MostPlayed} from './mostplayed';

export type platform = 'pc' | 'xbl' | 'psn';
export type Hero = Exclude<typeof heroIDMap[keyof typeof heroIDMap], 'overall'>;

export interface AllStats extends BasicInfo {
  heroStats: HeroStats;
  mostPlayed: MostPlayed;
}

export async function getAllStats(
  battletag: string,
  platform: platform
): Promise<AllStats> {
  const html = await getHtml(battletag, platform);

  const basicInfo = await getBasicInfo(battletag, platform, html);
  const heroStats = await getHeroStats(battletag, platform, html);
  const mostPlayed = await getMostPlayed(battletag, platform, html);

  return {...basicInfo, heroStats: heroStats, mostPlayed: mostPlayed};
}

export {getBasicInfo, getHeroStats, getMostPlayed};
