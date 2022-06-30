import * as cheerio from 'cheerio';
import {Hero, platform} from '.';
import {getHtml} from './gethtml';
import {heroIDMap} from './heroids';
import {DeepPartial} from './utils';

export interface HeroStats {
  competitive: HeroStatsGroup;
  quickplay: HeroStatsGroup;
}

export interface HeroStatsGroup extends Record<Hero, RegularHero> {
  overall: HeroBase;
}

export interface HeroBase {
  assists: {
    defensive_assists: string;
    defensive_assists_avg_per_10_min: string;
    defensive_assists_most_in_game: string;
    healing_done: string;
    healing_done_avg_per_10_min: string;
    healing_done_most_in_game: string;
    offensive_assists: string;
    offensive_assists_avg_per_10_min: string;
    offensive_assists_most_in_game: string;
    recon_assists: string;
    recon_assists_avg_per_10_min: string;
    recon_assists_most_in_game: string;
  };
  average: {
    all_damage_done_avg_per_10_min: string;
    barrier_damage_done_avg_per_10_min: string;
    critical_hits_avg_per_10_min: string;
    deaths_avg_per_10_min: string;
    eliminations_avg_per_10_min: string;
    eliminations_per_life: string;
    final_blows_avg_per_10_min: string;
    hero_damage_done_avg_per_10_min: string;
    melee_final_blows_avg_per_10_min: string;
    objective_kills_avg_per_10_min: string;
    objective_time_avg_per_10_min: string;
    solo_kills_avg_per_10_min: string;
    time_spent_on_fire_avg_per_10_min: string;
  };
  best: {
    all_damage_done_most_in_game: string;
    all_damage_done_most_in_life: string;
    barrier_damage_done_most_in_game: string;
    critical_hits_most_in_game: string;
    critical_hits_most_in_life: string;
    eliminations_most_in_game: string;
    eliminations_most_in_life: string;
    final_blows_most_in_game: string;
    hero_damage_done_most_in_game: string;
    hero_damage_done_most_in_life: string;
    kill_streak_best: string;
    melee_final_blows_most_in_game: string;
    multikill_best: string;
    objective_kills_most_in_game: string;
    objective_time_most_in_game: string;
    solo_kills_most_in_game: string;
    time_spent_on_fire_most_in_game: string;
    weapon_accuracy_best_in_game: string;
  };
  combat: {
    all_damage_done: string;
    barrier_damage_done: string;
    critical_hit_accuracy: string;
    critical_hits: string;
    deaths: string;
    eliminations: string;
    environmental_kills: string;
    final_blows: string;
    hero_damage_done: string;
    melee_final_blows: string;
    multikills: string;
    objective_kills: string;
    objective_time: string;
    quick_melee_accuracy: string;
    solo_kills: string;
    time_spent_on_fire: string;
    weapon_accuracy: string;
  };
  game: {
    games_won: string;
    time_played: string;
  };
  match_awards: {
    cards: string;
    medals: string;
    medals_bronze: string;
    medals_gold: string;
    medals_silver: string;
  };
  miscellanueous: {
    teleporter_pad_destroyed: string;
    turrets_destroyed: string;
  };
}

export interface RegularHero extends HeroBase {
  hero_specific: Record<string, string>;
}

/**
 * Gets stats about the heroes
 * @param battletag Use the `'NAME-DISCRIMINATOR'` format if on pc, otherwise just type the name (case sensitive)
 * @param platform Either `'pc'`, `'xbl'` or `'psn'`
 * @param html The HTML page, if you already have it
 */
export async function getHeroStats(
  battletag: string,
  platform: platform,
  html?: string
): Promise<HeroStats> {
  const $ = cheerio.load(html || (await getHtml(battletag, platform)));

  const data: DeepPartial<HeroStats> = {
    quickplay: {},
    competitive: {},
  };

  ['competitive', 'quickplay'].forEach(type => {
    // find stat groups (grouping per-hero or "overall")
    $('#' + type)
      .find('[data-group-id=stats]')
      .each(function () {
        // check for hero ID
        const heroID = $(this).attr('data-category-id') as
          | keyof typeof heroIDMap
          | undefined;
        if (heroID) {
          // get the hero name
          const heroName = heroIDMap[heroID];
          if (heroName) {
            // hero stat object
            const hero: Record<string, Record<string, string>> = {
              hero_specific: {},
              combat: {},
              assists: {},
              best: {},
              average: {},
              game: {},
              miscellaneous: {},
              match_awards: {},
            };

            // look at the table data for info
            $(this)
              .find('.stat-title')
              .each(function () {
                // get the category of this info by looking at table header
                const category = $(this)
                  .text()
                  .replace(/\s+/g, '_')
                  .toLowerCase() as keyof typeof hero;
                $(this)
                  .parent()
                  .parent()
                  .parent()
                  .next()
                  .children()
                  .each(function () {
                    const row = $(this).children();
                    const stat = row
                      .first()
                      .text()
                      .replace(/-/g, '') // remove - for "x - most in game" stats
                      .replace(/\s+/g, '_') // replace spaces with underscores
                      .toLowerCase();
                    const result = row.last().text().replace(/,/g, '');
                    hero[category][stat] = result;
                  });
              });
            // then add all the stats for the hero to the main object
            data[type as keyof typeof data]![heroName] = hero;
          }
        }
      });
  });

  return data as HeroStats;
}
