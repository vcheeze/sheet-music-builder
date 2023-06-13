import Fuse from 'fuse.js';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { CONFIDENCE_THRESHOLD, SEARCH_LIMIT } from '../constants.js';

export const getSongFolders = async (songTitles, dbx) => {
  // fetch all song folders from Dropbox
  const allSongs = await dbx.filesListFolder({
    include_non_downloadable_files: false,
    path: '/United Christian Church of Dubai Music',
  });
  // use Fuse for fuzzy search
  // which is better than Dropbox's search API
  const fuse = new Fuse(allSongs.result.entries, {
    keys: ['name'],
    includeScore: true,
  });
  let songsToConfirm = [];
  const songFolders = await Promise.all(
    songTitles.map(async (song, index) => {
      // TODO add console message here
      const searchResult = fuse.search(song, { limit: SEARCH_LIMIT });
      // a score greater than the confidence threshold implies no perfect or close matches
      // score of 0 = perfect match
      // score of 1 = complet mismatch
      if (
        searchResult.length > 0 &&
        searchResult[0].score > CONFIDENCE_THRESHOLD
      ) {
        // TODO add console message here
        // not confident about the match, push for user confirmation later
        songsToConfirm.push({
          type: 'checkbox',
          name: song,
          message: `A close match could not be found for ${chalk
            .hex('#cfa966')
            .italic(song)}. Please select one of the folders below: `,
          choices: searchResult.map((s) => ({
            name: s.item.name,
            value: s.item.path_display,
            short: s.item.name,
          })),
          loop: false,
        });
        return song;
      } else {
        // TODO add console message here
        return { song, path: searchResult[0].item.path_display };
      }
    })
  );
  if (songsToConfirm.length > 0) {
    const confirmedSongs = await inquirer.prompt(songsToConfirm);
    Object.entries(confirmedSongs).forEach(([key, value]) => {
      const indexToInsert = songFolders.findIndex((f) => f === key);
      songFolders[indexToInsert] = { song: key, path: value[0] };
    });
  }

  return songFolders;
};
