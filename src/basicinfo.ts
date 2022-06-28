import * as cheerio from 'cheerio';
import {platform} from '.';
import {getHtml} from './gethtml';
import {getPrestige} from './prestige';

export interface BasicInfo {
  battletag: string;
  borderURL: string;
  endorsementLevel: string;
  endorsements: {
    shotcaller: string;
    sportsmanship: string;
    teammate: string;
  };
  iconURL: string;
  level: string;
  prestige: number;
  profileURL: string;
  rank: Rank;
  starsURL: string;
}

export interface Rank {
  damage?: RankRole;
  support?: RankRole;
  tank?: RankRole;
}

export interface RankRole {
  sr: string;
  roleIcon: string;
  tierIcon: string;
}

/**
 * Gets some basic stats about the profile
 * @param battletag Use the `'NAME-DISCRIMINATOR'` format if on pc, otherwise just type the name (case sensitive)
 * @param platform Either `'pc'`, `'xbl'` or `'psn'`
 * @param html The HTML page, if you already have it
 */
export async function getBasicInfo(
  battletag: string,
  platform: platform,
  html?: string
): Promise<BasicInfo> {
  const $ = cheerio.load(html || (await getHtml(battletag, platform)));

  const borderURL =
    $('.player-level')
      .attr('style')
      ?.substring(21, ($('.player-level')?.attr('style')?.length || 0) - 1)
      .trim() || '';
  let starsURL = $('.player-rank').attr('style') || '';
  if (starsURL) {
    starsURL = starsURL
      .substring(21, ($('.player-rank').attr('style')?.length || 0) - 1)
      .trim();
    if (
      starsURL ===
      'https://d1u1mce87gyfbn.cloudfront.net/game/playerlevelrewards/0x025000000000095F_Rank.png'
    ) {
      starsURL = '';
    }
  }

  const rank: Rank = {};

  $('.competitive-rank-role').each((index, element) => {
    const roleIcon =
      $(element).find('.competitive-rank-role-icon').first().attr('src') || '';
    const roleName = $(element)
      .find('.competitive-rank-tier-tooltip')
      .attr('data-ow-tooltip-text')
      ?.split(' ')[0]
      .toLowerCase();
    const tierIcon =
      $(element).find('.competitive-rank-tier-icon').attr('src') || '';
    const sr = $(element).find('.competitive-rank-level').text();

    if (roleName)
      rank[roleName as keyof Rank] = {
        sr,
        roleIcon,
        tierIcon,
      };
  });

  return {
    battletag,
    rank,
    level: $('.player-level').find('div').first().text(),
    prestige: getPrestige(borderURL, starsURL) || 0,
    endorsementLevel: $('.endorsement-level').first().next().text() || '0',
    endorsements: {
      shotcaller: (
        Number($('.EndorsementIcon-border--shotcaller').attr('data-value')) *
          100 || 0
      ).toFixed(),
      teammate: (
        Number($('.EndorsementIcon-border--teammate').attr('data-value')) *
          100 || 0
      ).toFixed(),
      sportsmanship: (
        Number($('.EndorsementIcon-border--sportsmanship').attr('data-value')) *
          100 || 0
      ).toFixed(),
    },
    profileURL: encodeURI(
      `https://playoverwatch.com/en-us/career/${platform}/${battletag}`
    ),
    iconURL: $('.player-portrait').attr('src') || '',
    borderURL,
    starsURL,
  };
}
