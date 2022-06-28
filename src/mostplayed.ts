import * as cheerio from 'cheerio';
import {Hero, platform} from '.';
import {getHtml} from './gethtml';
import {heroIDMap} from './heroids';
import {DeepPartial} from './utils';

export interface MostPlayed {
  competitive: Record<Hero, MostPlayedHero>;
  quickplay: Record<Hero, MostPlayedHero>;
}
export interface MostPlayedHero {
  img: string;
  time: string;
}

/**
 * Gets the playtime for every hero
 * @param battletag Use the `'NAME-DISCRIMINATOR'` format if on pc, otherwise just type the name (case sensitive)
 * @param platform Either `'pc'`, `'xbl'` or `'psn'`
 * @param html The HTML page, if you already have it
 */
export async function getMostPlayed(
  battletag: string,
  platform: platform,
  html?: string
): Promise<MostPlayed> {
  const $ = cheerio.load(html || (await getHtml(battletag, platform)));

  const data: DeepPartial<MostPlayed> = {
    quickplay: {},
    competitive: {},
  };

  ['competitive', 'quickplay'].forEach(type => {
    $('#' + type)
      .find('.career-section')
      .first()
      .find('[data-category-id="0x0860000000000021"]')
      .first()
      .find('.ProgressBar-title')
      .each(function () {
        const timePlayed = $(this).next().text();
        const imgURL = $(this).parent().parent().prev().attr('src') || '';
        const heroID = imgURL.substring(imgURL.length - 22, imgURL.length - 4);
        const heroName = heroIDMap[heroID as keyof typeof heroIDMap] as Hero;

        data[type as keyof typeof data]![heroName] = {
          time: timePlayed,
          img: imgURL,
        };
      });
  });

  return data as MostPlayed;
}
