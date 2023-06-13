import chalk from 'chalk';

import { SEARCH_LIMIT } from '../constants.js';

export const getInitialFilesFromDropbox = async (songTitles, dbx) => {
  let selected = [];
  let notFound = [];
  await Promise.all(
    songTitles.map(async (title) => {
      const { result } = await dbx.filesSearchV2({
        options: {
          filename_only: true,
          file_categories: ['pdf'],
          max_results: SEARCH_LIMIT,
          order_by: 'last_modified_time',
          path: '/United Christian Church of Dubai Music',
        },
        query: title,
      });
      if (result.matches.length > 0) {
        selected.push({
          type: 'checkbox',
          name: title,
          message: `Select the files you would like to include for ${chalk
            .hex('#cfa966')
            .italic(title)}: `,
          choices: result.matches.map((s) => ({
            name: s.metadata.metadata.name,
            value: s.metadata.metadata.path_display,
            short: s.metadata.metadata.name,
          })),
          loop: false,
        });
      } else {
        notFound.push(title);
      }
    })
  );
  return { selected, notFound };
};
