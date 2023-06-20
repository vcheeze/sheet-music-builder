import { PDFDocument } from 'pdf-lib';
import path from 'path';
import { promises as fs } from 'fs';
import boxen from 'boxen';
import chalk from 'chalk';

import { boxenOptions } from '../utils.js';

export const createAndSaveFinalPdf = async (
  filePath,
  songTitles,
  finalSelection,
  dbx
) => {
  const pathParts = path.parse(filePath);
  const finalPath = `${pathParts.dir}${path.sep}${pathParts.name}_final.pdf`;
  const savingMessage = boxen(
    chalk.hex('#333333').bold('Creating sheet music...'),
    boxenOptions
  );
  console.log(savingMessage);
  // merge and create the final document
  const mergedPdf = await PDFDocument.create();
  const basePdfContent = await fs.readFile(filePath);
  const basePdfDoc = await PDFDocument.load(basePdfContent);
  const copiedPages = await mergedPdf.copyPages(
    basePdfDoc,
    basePdfDoc.getPageIndices()
  );
  copiedPages.forEach((page) => mergedPdf.addPage(page));
  // fetch files from Dropbox
  for (const song of songTitles) {
    if (finalSelection[song]?.length > 0) {
      for (const selection of finalSelection[song]) {
        const fileContent = await dbx.filesDownload({
          path: selection,
        });
        const pdfDoc = await PDFDocument.load(fileContent.result.fileBinary);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
    }
  }

  const mergedPdfDoc = await mergedPdf.save();
  await fs.writeFile(finalPath, mergedPdfDoc);
  const completedMessage = boxen(
    chalk.hex('#333333').bold('Sheet music created at:', finalPath),
    boxenOptions
  );
  console.log(completedMessage);
};
