import {
  getAllStats,
  getBasicInfo,
  getHeroStats,
  getMostPlayed,
} from '../src/index';

const battletag = 'HusseinObama-11715',
  platform = 'pc';

test('getBasicInfo', async () => {
  const res = await getBasicInfo(battletag, platform);

  expect(res).toStrictEqual({
    battletag: expect.any(String),
    borderURL: expect.any(String),
    endorsementLevel: expect.any(String),
    endorsements: {
      shotcaller: expect.any(String),
      sportsmanship: expect.any(String),
      teammate: expect.any(String),
    },
    iconURL: expect.any(String),
    level: expect.any(String),
    prestige: expect.any(Number),
    profileURL: expect.any(String),
    rank: expect.any(Object),
    starsURL: expect.any(String),
  });
});

test('getHeroStats', async () => {
  const res = await getHeroStats(battletag, platform);

  expect(typeof res).toBe('object');
  expect(typeof res.competitive).toBe('object');
  expect(typeof res.quickplay).toBe('object');
});

test('getMostPlayed', async () => {
  const res = await getMostPlayed(battletag, platform);

  expect(typeof res).toBe('object');
  expect(typeof res.competitive).toBe('object');
  expect(typeof res.quickplay).toBe('object');
});

test('getAllStats', async () => {
  const res = await getAllStats(battletag, platform);

  expect(res).toStrictEqual({
    battletag: expect.any(String),
    borderURL: expect.any(String),
    endorsementLevel: expect.any(String),
    endorsements: {
      shotcaller: expect.any(String),
      sportsmanship: expect.any(String),
      teammate: expect.any(String),
    },
    iconURL: expect.any(String),
    level: expect.any(String),
    prestige: expect.any(Number),
    profileURL: expect.any(String),
    rank: expect.any(Object),
    starsURL: expect.any(String),

    heroStats: expect.any(Object),
    mostPlayed: expect.any(Object),
  });
});
