import inquirer from 'inquirer';
import chalk from 'chalk';
import boxen from 'boxen';
import PDFParser from 'pdf2json';
import { Dropbox } from 'dropbox';
import { config } from 'dotenv';
import merge from 'lodash/merge.js';

import { welcome } from './lib/welcome.js';
import { getSongTitles } from './lib/getSongTitles.js';
import { getInitialFilesFromDropbox } from './lib/getInitialFilesFromDropbox.js';
import { filterUnselected } from './lib/filterUnselected.js';
import { getSongFolders } from './lib/getSongFolders.js';
import { getRemainingSelection } from './lib/getRemainingSelection.js';
import { createAndSaveFinalPdf } from './lib/createAndSaveFinalPdf.js';

config();

async function main() {
  welcome();

  // ask for basic info
  let { filePath, instruments } = await inquirer.prompt([
    {
      type: 'input',
      name: 'filePath',
      message:
        'Please enter the Order of Service PDF (exported from Notion) file path: ',
    },
    {
      type: 'checkbox',
      name: 'instruments',
      message: 'Please choose the instruments: ',
      choices: ['guitar', 'piano', 'bass', 'drums/cajon'],
    },
  ]);
  filePath = filePath.trim();

  const pdfParser = new PDFParser(this, 1);
  pdfParser.on('pdfParser_dataError', (errData) =>
    console.error(errData.parserError)
  );
  pdfParser.on('pdfParser_dataReady', async (pdfData) => {
    const songTitles = await getSongTitles(pdfParser);
    console.log('songTitles :>> ', songTitles);

    const dbx = new Dropbox({
      accessToken: process.env.DROPBOX_API_TOKEN,
    });

    const { selected, notFound } = await getInitialFilesFromDropbox(
      songTitles,
      dbx
    );
    const initialSelection = await inquirer.prompt(selected);
    const boxenOptions = {
      padding: 1,
      margin: 1,
      borderStyle: 'single',
      borderColor: '#cfa966',
      backgroundColor: '#99b5bf',
    };
    const initialSelectionMessage = boxen(
      chalk
        .hex('#333333')
        .bold(
          [
            '----- Initial Selection -----',
            ...Object.keys(initialSelection),
          ].join('\n')
        ),
      boxenOptions
    );
    console.log(initialSelectionMessage);
    // check for any songs for which the user has not selected any options
    const unselected = filterUnselected(initialSelection);
    const songFolders = await getSongFolders([...unselected, ...notFound], dbx);

    const remainingSelection = await getRemainingSelection(songFolders, dbx);

    const finalSelection = merge(initialSelection, remainingSelection);

    await createAndSaveFinalPdf(filePath, songTitles, finalSelection, dbx);
  });

  pdfParser.loadPDF(filePath.trim());
}

main();
