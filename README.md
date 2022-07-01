# @endbug/overwatch-stats-api

_Get stats from Blizzard's career profile pages._

https://playoverwatch.com/en-us/career/PLATFORM/BATTLETAG

Gets rank level, endorsements, hero stats and most played time for quickplay and competitive.

## Usage
```ts
import * as owapi from '@endbug/overwatch-stats-api'

(async () => {
  const stats = await ow.getAllStats('xQc-11273', 'pc');
  console.log(stats);
})();
```

## Please note
 - Profiles in Overwatch are private by default and this module can only get stats that are publicly available. You can make your profile public in game under options -> social -> career profile visibility: PUBLIC
 - Profile visibility and the profile stats in general only update upon exiting the game: they may take some time to update on Blizzard's website and therefore through this module.
 - Because this module gets the profile page and parses it, best practice would be to simply use `getAllStats()` and cache it for some time, using each part as needed since accessing and downloading the whole page multiple times for each different section of stats will result in excessive hits to Blizzard's site and could potentially lead to ratelimits.
 - This module does not do any caching and you should definitely consider this if using it in some kind of web API application.

## Methods

You can see the actual results of the commands by using the [interactive demo on RunKit](https://npm.runkit.com/@endbug/overwatch-stats-api).  
There are pre-compiled example responses in the `examples` directory of this repo.

`battletag` are Blizzard battletags in the `"NAME-DISCRIMINATOR"` format (e.g. `"xQc-11273"`) and are case sensitive.  
`platform` can be either `pc`, `xbl` or `psn` for PC, Xbox Live and PlayStation Network profiles respectively.

### `getAllStats(battletag, platform)`
Get all stats from other 3 methods combined.  

### `getBasicInfo(battletag, platform)`
Get basic info like rank, level, endorsements and link to profile, stars and border images.

### `getHeroStats(battletag, platform)`
Get hero stats for competitive and quickplay with categories under each hero and an "overall" hero for overall stats in that mode.
### `getMostPlayed(battletag, platform)`
Get the most played heros for competitive and quickplay with a HH:MM:SS time string and link to their thumbnail image in descending order of time played.

## Rejections
These methods return promises that are sometimes rejected with an `Error`:
- If the profile can't be found: `Error('PROFILE_NOT_FOUND');`
- If the profile is private. `Error('PROFILE_PRIVATE');`

## Credits

This package is forked from [`overwatch-stats-api`](https://www.npmjs.com/package/overwatch-stats-api) by [@fatchan](https://github.com/fatchan)
