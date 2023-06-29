import chalk from 'chalk';
import inquirer from 'inquirer';

export const getRemainingSelection = async (songFolders, dbx) => {
  const remainingQuestions = [];
  await Promise.all(
    songFolders.map(async (folder) => {
      if (folder.path) {
        const files = await dbx.filesListFolder({
          include_non_downloadable_files: false,
          path: folder.path,
        });
        remainingQuestions.push({
          type: 'checkbox',
          name: folder.song,
          message: `Choose what files to include for ${chalk
            .hex('#cfa966')
            .italic(folder.song)}: `,
          choices: files.result.entries.map((entry) => ({
            name: entry.name,
            value: entry.path_display,
            short: entry.name,
          })),
        });
      }
    })
  );
  const remainingSelection = await inquirer.prompt(remainingQuestions);

  return remainingSelection;
};
